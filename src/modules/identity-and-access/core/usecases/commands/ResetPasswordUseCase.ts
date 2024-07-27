import { UseCase } from '@shared/core/usecases/UseCase';
import { ResetPasswordRequestDto, ResetPasswordResponseDto } from './dtos/ResetPasswordDto';
import { CachePort } from '@shared/core/ports/CachePort';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { User } from '@identity-and-access/core/domain/entities/User';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UserPassword } from '@identity-and-access/core/domain/value-objects/UserPassword';
import { CacheKeysPrefix } from '@identity-and-access/core/domain/constants/CacheKeysPrefix';

export class ResetPasswordUseCase implements UseCase<ResetPasswordRequestDto, ResetPasswordResponseDto> {
    constructor(
        private readonly userRopository: UserRepositoryPort,
        private readonly cache: CachePort,
        private readonly logger: LoggerPort,
    ) {}

    public async execute(request?: ResetPasswordRequestDto): Promise<ResetPasswordResponseDto> {
        const userId: UniqueId = UniqueId.create(request.userId);

        const user: User = await this.userRopository.findOne({ id: userId.getValue });
        AssertUtil.isTrue(
            !!user,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User with the given id does not exist!',
            }),
        );

        const storedToken: string = await this.cache.get<string>(
            `${CacheKeysPrefix.RESET_PASSWORD}:${userId.getValue}`,
        );
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

        const password: UserPassword = UserPassword.create(request.newPassword);
        password.hashPassword();

        user.edit({ password });

        await this.userRopository.updateOne(user);

        await this.cache.delete(`${CacheKeysPrefix.RESET_PASSWORD}:${userId.getValue}`);

        this.logger.log(
            `User with id: ${userId.getValue} changed their password successfully!`,
            ResetPasswordUseCase.name,
        );
    }
}
