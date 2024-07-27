import { UseCase } from '@shared/core/usecases/UseCase';
import { ChangePasswordRequestDto, ChangePasswordResponseDto } from './dtos/ChangePasswordDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UserPassword } from '@identity-and-access/core/domain/value-objects/UserPassword';
import { User } from '@identity-and-access/core/domain/entities/User';
import { LoggerPort } from '@shared/core/ports/LoggerPort';

export class ChangePasswordUseCase implements UseCase<ChangePasswordRequestDto, ChangePasswordResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly logger: LoggerPort,
    ) {}

    public async execute(request?: ChangePasswordRequestDto): Promise<ChangePasswordResponseDto> {
        const uniqueId: UniqueId = UniqueId.create(request.userId);

        let doesPasswordsMatch: boolean = request.oldPassword === request.newPassword;
        AssertUtil.isFalse(
            doesPasswordsMatch,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.Conflict,
                overrideMessage: 'Old password and new password are not allowed to be thesame!',
            }),
        );

        const user: User = await this.userRepository.findOne({ id: uniqueId.getValue });
        AssertUtil.isTrue(
            !!user,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User with the given id does not exist!',
            }),
        );

        doesPasswordsMatch = await user.getPassword.comparePasswords(request.oldPassword);
        AssertUtil.isTrue(
            doesPasswordsMatch,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.WRONG_CREDENTIALS_ERROR,
                overrideMessage: 'Invalid old password!',
            }),
        );

        const newPassword: UserPassword = UserPassword.create(request.newPassword);
        await newPassword.hashPassword();

        user.edit({ password: newPassword });

        await this.userRepository.updateOne(user);

        this.logger.log(`User with id: ${user.getId} changed their password successfully!`, ChangePasswordUseCase.name);
    }
}
