import { UseCase } from '@shared/core/usecases/UseCase';
import { GetUserDetailsRequestDto, GetUserDetailsResponseDto } from './dtos/GetUserDetailsDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { UserProfileRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserProfileRepositoryPort';
import { User } from '@identity-and-access/core/domain/entities/User';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UserProfile } from '@identity-and-access/core/domain/entities/UserProfile';

export class GetUserDetailsUseCase implements UseCase<GetUserDetailsRequestDto, GetUserDetailsResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userProfileRepository: UserProfileRepositoryPort,
    ) {}

    public async execute(request?: GetUserDetailsRequestDto): Promise<GetUserDetailsResponseDto> {
        AssertUtil.isTrue(
            !!request.userId,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.BAD_REQUEST_ERROR,
                overrideMessage: 'User id is required!',
            }),
        );

        const user: User = await this.userRepository.findOne({ id: request.userId });
        AssertUtil.isTrue(
            !!user,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User not found!',
            }),
        );

        const userProfile: UserProfile = await this.userProfileRepository.findOne({ userId: user.getId.getValue });

        const userDetails: { user: User; profile: UserProfile } = { user, profile: userProfile };

        return GetUserDetailsResponseDto.newFromUser(userDetails);
    }
}
