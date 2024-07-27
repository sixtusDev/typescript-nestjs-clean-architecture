import { UseCase } from '@shared/core/usecases/UseCase';
import { VerifyEmailRequestDto, VerifyEmailResponseDto } from './dtos/VerifyEmailDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { CachePort } from '@shared/core/ports/CachePort';
import { User } from '@identity-and-access/core/domain/entities/User';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { CacheKeysPrefix } from '@identity-and-access/core/domain/constants/CacheKeysPrefix';

export class VerifyEmailUseCase implements UseCase<VerifyEmailRequestDto, VerifyEmailResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly cache: CachePort,
        private readonly logger: LoggerPort,
    ) {}

    public async execute(request?: VerifyEmailRequestDto): Promise<VerifyEmailResponseDto> {
        const isValidRequestPayload: boolean = !!(request.token && request.userId);
        AssertUtil.isTrue(
            isValidRequestPayload,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.BAD_REQUEST_ERROR,
                overrideMessage: 'Invalid token or user id!',
            }),
        );

        const storedToken: string = await this.cache.get(`${CacheKeysPrefix.VERIFY_EMAIL}:${request.userId}`);
        AssertUtil.isTrue(
            !!storedToken,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.BAD_REQUEST_ERROR,
                overrideMessage: 'Invalid verification token!',
            }),
        );

        const isValidToken: boolean = storedToken === request.token;
        AssertUtil.isTrue(
            isValidToken,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.BAD_REQUEST_ERROR,
                overrideMessage: 'Invalid verification token!',
            }),
        );

        const user: User = await this.userRepository.findOne({ id: request.userId });
        AssertUtil.isTrue(
            !!user,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User with the given email does not exist!',
            }),
        );

        AssertUtil.isFalse(
            user.getIsEmailVerified,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.Conflict,
                overrideMessage: 'Email already verified!',
            }),
        );

        user.edit({ isEmailVerified: true });

        await this.userRepository.updateOne(user);

        this.logger.log(`User with id, ${user.getId} verified successfully!`, VerifyEmailUseCase.name);

        await this.cache.delete(`${CacheKeysPrefix.VERIFY_EMAIL}:${request.userId}`);
    }
}
