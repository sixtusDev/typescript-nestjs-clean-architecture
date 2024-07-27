import { UseCase } from '@shared/core/usecases/UseCase';
import { UpdateUserProfileRequestDto, UpdateUserProfileResponseDto } from './dtos/UpdateUserProfileDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { UserProfileRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserProfileRepositoryPort';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UserProfile } from '@identity-and-access/core/domain/entities/UserProfile';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { FilePurpose, FileStoragePort } from '@shared/core/ports/FileStoragePort';
import { Nullable } from '@shared/core/types/UtilityTypes';

export class UpdateUserProfileUseCase implements UseCase<UpdateUserProfileRequestDto, UpdateUserProfileResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userProfileRepository: UserProfileRepositoryPort,
        private readonly fileStorage: FileStoragePort,
        private readonly logger: LoggerPort,
    ) {}

    public async execute(request?: UpdateUserProfileRequestDto): Promise<UpdateUserProfileResponseDto> {
        const userId: UniqueId = UniqueId.create(request.userId);

        const doesUserExist: boolean = await this.userRepository.exists({ id: userId.getValue });
        AssertUtil.isTrue(
            doesUserExist,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User not found!',
            }),
        );

        const userProfile: UserProfile = await this.userProfileRepository.findOne({ userId: userId.getValue });
        AssertUtil.isTrue(
            !!userProfile,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User profile not found!',
            }),
        );

        let fileUrl: Nullable<string> = null;
        if (request.profilePicture) {
            fileUrl = await this.fileStorage.uploadFIle(FilePurpose.PROFILE, request.profilePicture);
        }

        userProfile.update({
            bio: request.bio,
            preferredLearningTimes: request.preferredLearningTimes,
            updatedBy: userId.getValue,
            profilePictureUrl: fileUrl,
        });

        await this.userProfileRepository.updateOne(userProfile);

        this.logger.log(`User with id: ${userId.getValue} updated their profile`, UpdateUserProfileUseCase.name);
    }
}
