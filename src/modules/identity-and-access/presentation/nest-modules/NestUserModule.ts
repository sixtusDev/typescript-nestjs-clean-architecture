import { UserDITokens } from '@identity-and-access/core/domain/constants/UserDITokens';
import { CreateUserUseCase } from '@identity-and-access/core/usecases/commands/CreateUserUseCase';
import { PrismaUserRepositoryAdapter } from '@identity-and-access/infrastructure/persistence/prisma/repositories/PrismaUserRepositoryAdapter';
import { Module, Provider } from '@nestjs/common';
import { UserController } from '../http/controllers/UserController';
import { UserCreatedEventHandler } from '@identity-and-access/core/handlers/UserCreatedEventHandler';
import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { NestNotificationModule } from '@notification/presentation/nest-modules/NestNotificationModule';
import { EventBusPort } from '@shared/core/ports/EventBusPort';
import { UserEventNames } from '@identity-and-access/core/domain/constants/UserEventNames';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { CachePort } from '@shared/core/ports/CachePort';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { ChangePasswordUseCase } from '@identity-and-access/core/usecases/commands/ChangePasswordUseCase';
import { SendEmailNotificationUseCase } from '@notification/core/usecases/SendEmailNotificationUseCase';
import { CreateUserProfileUseCase } from '@identity-and-access/core/usecases/commands/CreateUserProfileUseCase';
import { UserProfileRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserProfileRepositoryPort';
import { UpdateUserProfileUseCase } from '@identity-and-access/core/usecases/commands/UpdateUserProfileUseCase';
import { FileStoragePort } from '@shared/core/ports/FileStoragePort';
import { PrismaUserProfileRepositoryAdapter } from '@identity-and-access/infrastructure/persistence/prisma/repositories/PrismaUserProfileRepositoryAdapter';
import { GetUserDetailsUseCase } from '@identity-and-access/core/usecases/queries/GetUserDetailsUseCase';
import { CreateUserRoleUseCase } from '@identity-and-access/core/usecases/commands/CreateUserRoleUseCase';
import { RoleRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/RoleRepositoryPort';
import { UserRoleRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRoleRepositoryPort';
import { PrismaUserRoleRepositoryAdapter } from '@identity-and-access/infrastructure/persistence/prisma/repositories/PrismaUserRoleRepositoryAdapter';
import { PrismaRoleRepositoryAdapter } from '@identity-and-access/infrastructure/persistence/prisma/repositories/PrismaRoleRepositoryAdapter';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { DbTransactionPort } from '@shared/core/ports/dbTransactionPort';
import { PrismaClient } from '@prisma/client';

const useCaseProviders: Provider[] = [
    {
        provide: CreateUserUseCase,
        useFactory: (
            userRepository: UserRepositoryPort,
            eventBust: EventBusPort,
            logger: LoggerPort,
            createUserProfileUseCase: CreateUserProfileUseCase,
            createUserRoleUseCase: CreateUserRoleUseCase,
            dbTransaction: DbTransactionPort,
        ) =>
            new CreateUserUseCase(
                userRepository,
                eventBust,
                logger,
                createUserProfileUseCase,
                createUserRoleUseCase,
                dbTransaction,
            ),
        inject: [
            UserDITokens.USER_REPOSITORY,
            CoreDITokens.EVENT_BUS,
            CoreDITokens.LOGGER,
            CreateUserProfileUseCase,
            CreateUserRoleUseCase,
            CoreDITokens.DB_TRANSACTION,
        ],
    },
    {
        provide: ChangePasswordUseCase,
        useFactory: (userRepository: UserRepositoryPort, logger: LoggerPort) =>
            new ChangePasswordUseCase(userRepository, logger),
        inject: [UserDITokens.USER_REPOSITORY, CoreDITokens.LOGGER],
    },
    {
        provide: CreateUserProfileUseCase,
        useFactory: (
            userRepository: UserRepositoryPort,
            userProfileRepository: UserProfileRepositoryPort,
            logger: LoggerPort,
        ) => new CreateUserProfileUseCase(userRepository, userProfileRepository, logger),
        inject: [UserDITokens.USER_REPOSITORY, UserDITokens.USER_PROFILE_REPOSITORY, CoreDITokens.LOGGER],
    },
    {
        provide: UpdateUserProfileUseCase,
        useFactory: (
            userRepository: UserRepositoryPort,
            userProfileRepository: UserProfileRepositoryPort,
            fileStorage: FileStoragePort,
            logger: LoggerPort,
        ) => new UpdateUserProfileUseCase(userRepository, userProfileRepository, fileStorage, logger),
        inject: [
            UserDITokens.USER_REPOSITORY,
            UserDITokens.USER_PROFILE_REPOSITORY,
            CoreDITokens.FILE_STORAGE,
            CoreDITokens.LOGGER,
        ],
    },
    {
        provide: GetUserDetailsUseCase,
        useFactory: (userRepository: UserRepositoryPort, userProfileRepository: UserProfileRepositoryPort) =>
            new GetUserDetailsUseCase(userRepository, userProfileRepository),
        inject: [UserDITokens.USER_REPOSITORY, UserDITokens.USER_PROFILE_REPOSITORY],
    },
    {
        provide: CreateUserRoleUseCase,
        useFactory: (
            userRepository: UserRepositoryPort,
            userRoleRepository: UserRoleRepositoryPort,
            roleRepository: RoleRepositoryPort,
        ) => new CreateUserRoleUseCase(userRepository, userRoleRepository, roleRepository),
        inject: [UserDITokens.USER_REPOSITORY, UserDITokens.USER_ROLE_REPOSITORY, UserDITokens.ROLE_REPOSITORY],
    },
];

const persistenceProviders: Provider[] = [
    {
        provide: UserDITokens.USER_REPOSITORY,
        useFactory: (prisma: PrismaClient) => new PrismaUserRepositoryAdapter(prisma),
        inject: [PrismaClient],
    },
    {
        provide: UserDITokens.USER_PROFILE_REPOSITORY,
        useFactory: (prisma: PrismaClient) => new PrismaUserProfileRepositoryAdapter(prisma),
        inject: [PrismaClient],
    },
    {
        provide: UserDITokens.USER_ROLE_REPOSITORY,
        useFactory: (prisma: PrismaClient) => new PrismaUserRoleRepositoryAdapter(prisma),
        inject: [PrismaClient],
    },
    {
        provide: UserDITokens.ROLE_REPOSITORY,
        useFactory: (prisma: PrismaClient) => new PrismaRoleRepositoryAdapter(prisma),
        inject: [PrismaClient],
    },
];

const handlerProviders: Provider[] = [
    {
        provide: UserCreatedEventHandler,
        useFactory: (
            sendEmailNotificationUseCase: SendEmailNotificationUseCase<unknown>,
            cache: CachePort,
            logger: LoggerPort,
            config: ConfigPort,
        ) => new UserCreatedEventHandler(sendEmailNotificationUseCase, cache, logger, config),
        inject: [SendEmailNotificationUseCase, CoreDITokens.CACHE, CoreDITokens.LOGGER, CoreDITokens.CONFIG],
    },
];

const userEventsSubscribersProvider: Provider = {
    provide: CoreDITokens.EVENT_SUBSCRIBER,
    useFactory: (eventBus: EventBusPort, userCreatedEventHandler: UserCreatedEventHandler) => {
        eventBus.subscribe(UserEventNames.USER_CREATED, userCreatedEventHandler.handle.bind(userCreatedEventHandler));
    },
    inject: [CoreDITokens.EVENT_BUS, UserCreatedEventHandler],
};

@Module({
    imports: [NestNotificationModule],
    controllers: [UserController],
    providers: [userEventsSubscribersProvider, ...useCaseProviders, ...persistenceProviders, ...handlerProviders],
    exports: [UserDITokens.USER_REPOSITORY],
})
export class NestUserModule {}
