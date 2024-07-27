import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { NestAppModule } from './nest-modules/NestAppModule';
import { TaskHandlerRegistry } from '@shared/core/handlers/TaskHandlerRegistry';
import helmet from 'helmet';
import * as winston from 'winston';
import { WinstonLoggerAdapter } from '@shared/infrastructure/adapters/logger/WinstonLoggerAdapter';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { LoggerConfig } from '@shared/infrastructure/config/LoggerConfig';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { EnvConfigAdapter } from '@shared/infrastructure/adapters/config/EnvConfigAdapter';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';

export class Application {
    private readonly config: ConfigPort = new EnvConfigAdapter();
    private readonly logger: LoggerPort = new WinstonLoggerAdapter(
        winston.createLogger(LoggerConfig.createWinstonLoggerConfig()),
    );

    private readonly host: string = this.config.getString(ConfigKeys.APP_HOST);
    private readonly port: number = this.config.getInt(ConfigKeys.APP_PORT);

    public async run(): Promise<void> {
        const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(NestAppModule, {
            logger: this.logger,
        });

        app.enableCors();

        app.use(helmet());

        app.useGlobalPipes(new ValidationPipe({ transform: true }));

        const jobHandlerRegistry = app.get(TaskHandlerRegistry);
        jobHandlerRegistry.setupAll();

        this.buildAPIDocumentation(app);
        this.log();

        await app.listen(this.port, this.host);
    }

    private buildAPIDocumentation(app: NestExpressApplication): void {
        const title: string = 'TypeScript Nestjs Clean Architecture';
        const description: string = 'TypeScript Nestjs Clean Architecture API documentation';
        const version: string = '1.0.0';

        const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
            .setTitle(title)
            .setDescription(description)
            .setVersion(version)
            .addBearerAuth({
                type: 'apiKey',
                in: 'header',
                name: this.config.getString(ConfigKeys.JWT_ACCESS_TOKEN_HEADER),
            })
            .build();

        const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

        SwaggerModule.setup('api-docs', app, document);
    }

    private log(): void {
        this.logger.log(`Server started on host: ${this.host}; port: ${this.port};`, Application.name);
    }

    public static create(): Application {
        return new Application();
    }
}
