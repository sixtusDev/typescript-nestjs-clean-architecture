import { UseCase } from '@shared/core/usecases/UseCase';
import { CreateUserProfileRequestDto, CreateUserProfileResponseDto } from './dtos/CreateUserProfileDto';
import { UserProfileRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserProfileRepositoryPort';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UserProfile } from '@identity-and-access/core/domain/entities/UserProfile';

export class CreateUserProfileUseCase implements UseCase<CreateUserProfileRequestDto, CreateUserProfileResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userProfileRepository: UserProfileRepositoryPort,
        private readonly logger: LoggerPort,
    ) {}

    public async execute(
        request?: CreateUserProfileRequestDto,
        transactionRef?: unknown,
    ): Promise<CreateUserProfileResponseDto> {
        const userId: UniqueId = UniqueId.create(request.userId);

        const doesUserExist: boolean = await this.userRepository.exists({ id: userId.getValue });
        AssertUtil.isFalse(
            doesUserExist,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_ALREADY_EXISTS_ERROR,
                overrideMessage: 'User already exists!',
            }),
        );

        const userProfile: UserProfile = UserProfile.create({ userId, lastActiveAt: new Date() });
        await this.userProfileRepository.createOne(userProfile, transactionRef);

        this.logger.log(
            `Created new user profile for user with the id: ${userId.getValue}`,
            CreateUserProfileUseCase.name,
        );
    }
}
