import { Global, Module, Provider } from '@nestjs/common';
import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { BullMQTaskQueueAdapter } from '@shared/infrastructure/adapters/messaging/task-queue/BullMqTaskQueueAdapter';
import { WinstonLoggerAdapter } from '@shared/infrastructure/adapters/logger/WinstonLoggerAdapter';
import { NestJsEventBusAdapter } from '@shared/infrastructure/adapters/messaging/event-bus/NestJsEventBusAdapter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '../http/exception-filters/HttpExceptionFilter';
import { HttpLoggingInterceptor } from '../http/interceptors/HttpLoggingInterceptor';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisCacheAdapter } from '@shared/infrastructure/adapters/cache/RedisCacheAdapter';
import { TerminusModule } from '@nestjs/terminus';
import { Redis } from 'ioredis';
import { HealthCheckController } from '../http/controllers/HealthCheckController';
import { HttpModule } from '@nestjs/axios';
import { CloudflareR2FileStorageAdapter } from '@shared/infrastructure/adapters/persistence/CloudflareR2FileStorageAdapter';
import { S3Client } from '@aws-sdk/client-s3';
import * as winston from 'winston';
import { LoggerConfig } from '@shared/infrastructure/config/LoggerConfig';
import { EnvConfigAdapter } from '@shared/infrastructure/adapters/config/EnvConfigAdapter';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { PrismaDbTransactionAdapter } from '@shared/infrastructure/adapters/persistence/PrismaDbTransactionAdapter';
import { PrismaClient } from '@prisma/client';

const configProvider: Provider = {
    provide: CoreDITokens.CONFIG,
    useClass: EnvConfigAdapter,
};

const throtlerProvider: Provider = {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
};

const cacheProvider: Provider = {
    provide: CoreDITokens.CACHE,
    useFactory: (config: ConfigPort) =>
        new RedisCacheAdapter(
            new Redis({
                host: config.getString(ConfigKeys.REDIS_HOST),
                port: config.getInt(ConfigKeys.REDIS_PORT),
                username: config.getString(ConfigKeys.REDIS_USERNAME, false),
                password: config.getString(ConfigKeys.REDIS_PASSWORD, false),
            }),
        ),
    inject: [CoreDITokens.CONFIG],
};

const fileStorageProvider: Provider = {
    provide: CoreDITokens.FILE_STORAGE,
    useFactory: (logger: LoggerPort, config: ConfigPort) =>
        new CloudflareR2FileStorageAdapter(
            new S3Client({
                region: config.getString(ConfigKeys.R2_REGION, false) ?? 'auto',
                endpoint: `https://${config.getString(ConfigKeys.CLOUDFLARE_ACCOUNT_ID)}.r2.cloudflarestorage.com`,
                credentials: {
                    accessKeyId: config.getString(ConfigKeys.R2_ACCESS_KEY_ID),
                    secretAccessKey: config.getString(ConfigKeys.R2_SECRET_ACCESS_KEY),
                },
            }),
            logger,
            config,
        ),
    inject: [CoreDITokens.LOGGER, CoreDITokens.CONFIG],
};

const prisma: PrismaClient = new PrismaClient();

const persistenceProviders: Provider[] = [
    // TODO: Change PrismaClient to 'PrismaClient'
    { provide: PrismaClient, useValue: prisma },
    {
        provide: CoreDITokens.DB_TRANSACTION,
        useFactory: (prisma: PrismaClient, logger: LoggerPort) => new PrismaDbTransactionAdapter(prisma, logger),
        inject: [PrismaClient, CoreDITokens.LOGGER],
    },
];

const exceptionProvider: Provider = {
    provide: APP_FILTER,
    useFactory: (logger: LoggerPort, config: ConfigPort) => new HttpExceptionFilter(logger, config),
    inject: [CoreDITokens.LOGGER, CoreDITokens.CONFIG],
};

const messagingProviders: Provider[] = [
    {
        provide: CoreDITokens.TASK_QUEUE,
        useFactory: (logger: LoggerPort, config: ConfigPort) =>
            new BullMQTaskQueueAdapter(
                { host: config.getString(ConfigKeys.REDIS_HOST), port: config.getInt(ConfigKeys.REDIS_PORT) },
                logger,
            ),
        inject: [CoreDITokens.LOGGER, CoreDITokens.CONFIG],
    },
    {
        provide: CoreDITokens.EVENT_BUS,
        useFactory: () => new NestJsEventBusAdapter(new EventEmitter2({ maxListeners: 10 })),
    },
];

const loggerProviders: Provider[] = [
    {
        provide: CoreDITokens.LOGGER,
        useFactory: () => new WinstonLoggerAdapter(winston.createLogger(LoggerConfig.createWinstonLoggerConfig())),
    },
    ...(process.env.ENABLE_LOG && [
        {
            provide: APP_INTERCEPTOR,
            useFactory: (logger: LoggerPort) => new HttpLoggingInterceptor(logger),
            inject: [CoreDITokens.LOGGER],
        },
    ]),
];

@Global()
@Module({
    imports: [
        HttpModule,
        ThrottlerModule.forRootAsync({
            useFactory: (config: ConfigPort) => [
                {
                    ttl: config.getInt(ConfigKeys.THROTTLER_TTL_IN_MINUTES),
                    limit: config.getInt(ConfigKeys.THROTTLER_LIMIT),
                },
            ],
            inject: [CoreDITokens.CONFIG],
        }),
        TerminusModule.forRoot({
            errorLogStyle: 'pretty',
            // TODO: Use env variable instead of magic number
            gracefulShutdownTimeoutMs: 1000,
        }),
    ],
    providers: [
        EventEmitter2,
        configProvider,
        throtlerProvider,
        cacheProvider,
        fileStorageProvider,
        exceptionProvider,
        ...persistenceProviders,
        ...messagingProviders,
        ...loggerProviders,
    ],
    exports: [
        PrismaClient,
        CoreDITokens.EVENT_BUS,
        CoreDITokens.TASK_QUEUE,
        CoreDITokens.LOGGER,
        CoreDITokens.CACHE,
        CoreDITokens.FILE_STORAGE,
        CoreDITokens.CONFIG,
        CoreDITokens.DB_TRANSACTION,
    ],
    controllers: [HealthCheckController],
})
export class NestSharedModule {}
