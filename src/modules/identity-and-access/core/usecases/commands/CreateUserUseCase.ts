import { CreateUserRequestDto, CreateUserResponseDto } from './dtos/CreateUserDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { User } from '@identity-and-access/core/domain/entities/User';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UseCase } from '@shared/core/usecases/UseCase';
import { EventBusPort } from '@shared/core/ports/EventBusPort';
import { UserCreatedEvent } from '@identity-and-access/core/domain/events/UserCreatedEvent';
import { UserPassword } from '@identity-and-access/core/domain/value-objects/UserPassword';
import { UserEventNames } from '@identity-and-access/core/domain/constants/UserEventNames';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { CreateUserProfileUseCase } from './CreateUserProfileUseCase';
import { CreateUserRoleUseCase } from './CreateUserRoleUseCase';
import { StringUtil } from '@shared/core/utils/StringUtil';
import { DbTransactionPort } from '@shared/core/ports/dbTransactionPort';

export class CreateUserUseCase implements UseCase<CreateUserRequestDto, CreateUserResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly eventBus: EventBusPort,
        private readonly logger: LoggerPort,
        private readonly createUserProfileUseCase: CreateUserProfileUseCase,
        private readonly createUserRoleUseCase: CreateUserRoleUseCase,
        private readonly dbTransaction: DbTransactionPort,
    ) {}

    public async execute(request?: CreateUserRequestDto): Promise<CreateUserResponseDto> {
        return await this.dbTransaction.run(async (transactionRef) => {
            const userPassword: UserPassword = UserPassword.create(request.password);
            await userPassword.hashPassword();

            let username: string = StringUtil.generateRandomUsername();

            let doesUserWithUsernameExist: boolean = await this.userRepository.exists({ username });

            while (doesUserWithUsernameExist) {
                username = StringUtil.generateRandomUsername();
                doesUserWithUsernameExist = await this.userRepository.exists({ username });
            }

            const user: User = User.create({
                username,
                firstName: request.firstName,
                lastName: request.lastName,
                email: request.email,
                password: userPassword,
                isEmailVerified: false,
            });

            const doesUserExist: boolean = await this.userRepository.exists({ email: user.getEmail });
            AssertUtil.isFalse(
                doesUserExist,
                CoreError.create({
                    codeDescription: CoreCodeDescriptions.ENTITY_ALREADY_EXISTS_ERROR,
                    overrideMessage: 'User Already exist!',
                }),
            );

            await this.userRepository.createOne(user, transactionRef);

            await this.createUserProfileUseCase.execute({ userId: user.getId.getValue }, transactionRef);

            await this.createUserRoleUseCase.execute(
                { userId: user.getId.getValue, roleName: request.role },
                transactionRef,
            );

            this.logger.log('New user created successfully!', CreateUserUseCase.name);

            const userCreatedEvent: UserCreatedEvent = UserCreatedEvent.create(new Date(), user);

            this.eventBus.emit(UserEventNames.USER_CREATED, userCreatedEvent);
        });
    }
}
