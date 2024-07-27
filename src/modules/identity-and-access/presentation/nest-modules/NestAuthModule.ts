import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { HttpAuthService } from '../http/auth/HttpAuthService';
import { HttpJwtStrategy } from '../http/auth/strategies/HttpJwtStrategy';
import { HttpLocalStrategy } from '../http/auth/strategies/HttpLocalStrategy';
import { AuthController } from '../http/controllers/AuthController';
import { NestUserModule } from './NestUserModule';
import { Module, Provider } from '@nestjs/common';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { UserDITokens } from '@identity-and-access/core/domain/constants/UserDITokens';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { VerifyEmailUseCase } from '@identity-and-access/core/usecases/commands/VerifyEmailUseCase';
import { CachePort } from '@shared/core/ports/CachePort';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { InitiateResetPasswordUseCase } from '@identity-and-access/core/usecases/commands/InitiateResetPasswordUseCase';
import { ResetPasswordUseCase } from '@identity-and-access/core/usecases/commands/ResetPasswordUseCase';
import { SendEmailNotificationUseCase } from '@notification/core/usecases/SendEmailNotificationUseCase';
import { NestNotificationModule } from '@notification/presentation/nest-modules/NestNotificationModule';

const useCaseProviders: Provider[] = [
    {
        provide: VerifyEmailUseCase,
        useFactory: (userRepository: UserRepositoryPort, cache: CachePort, logger: LoggerPort) =>
            new VerifyEmailUseCase(userRepository, cache, logger),
        inject: [UserDITokens.USER_REPOSITORY, CoreDITokens.CACHE, CoreDITokens.LOGGER],
    },
    {
        provide: ResetPasswordUseCase,
        useFactory: (userRepository: UserRepositoryPort, cache: CachePort, logger: LoggerPort) =>
            new ResetPasswordUseCase(userRepository, cache, logger),
        inject: [UserDITokens.USER_REPOSITORY, CoreDITokens.CACHE, CoreDITokens.LOGGER],
    },
    {
        provide: InitiateResetPasswordUseCase,
        useFactory: (
            userRepository: UserRepositoryPort,
            cache: CachePort,
            logger: LoggerPort,
            sendEmailNotificationUseCase: SendEmailNotificationUseCase<unknown>,
            config: ConfigPort,
        ) => new InitiateResetPasswordUseCase(userRepository, cache, logger, sendEmailNotificationUseCase, config),
        inject: [
            UserDITokens.USER_REPOSITORY,
            CoreDITokens.CACHE,
            CoreDITokens.LOGGER,
            SendEmailNotificationUseCase,
            CoreDITokens.CONFIG,
        ],
    },
];

@Module({
    controllers: [AuthController],
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigPort) => {
                return {
                    secret: config.getString(ConfigKeys.JWT_ACCESS_TOKEN_SECRET),
                    signOptions: { expiresIn: `${config.getInt(ConfigKeys.JWT_ACCESS_TOKEN_TTL_IN_MINUTES)}m` },
                };
            },
            inject: [CoreDITokens.CONFIG],
        }),
        NestUserModule,
        NestNotificationModule,
    ],
    providers: [...useCaseProviders, HttpAuthService, HttpLocalStrategy, HttpJwtStrategy],
})
export class NestAuthModule {}
