import { UseCase } from '@shared/core/usecases/UseCase';
import { InitiateResetPasswordRequestDto, InitiateResetPasswordResponseDto } from './dtos/InitiateResetPasswordDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { CachePort } from '@shared/core/ports/CachePort';
import { EmailAddress } from '@shared/core/value-objects/EmailAddress';
import { TokenUtil } from '@shared/core/utils/TokenUtil';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { User } from '@identity-and-access/core/domain/entities/User';
import { SendEmailNotificationUseCase } from '@notification/core/usecases/SendEmailNotificationUseCase';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { CacheKeysPrefix } from '@identity-and-access/core/domain/constants/CacheKeysPrefix';

export class InitiateResetPasswordUseCase
    implements UseCase<InitiateResetPasswordRequestDto, InitiateResetPasswordResponseDto>
{
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly cache: CachePort,
        private readonly logger: LoggerPort,
        private readonly sendEmailNotificationUseCase: SendEmailNotificationUseCase<{
            firstName: string;
            cta: { link: string; text: string };
        }>,
        private readonly config: ConfigPort,
    ) {}

    public async execute(request?: InitiateResetPasswordRequestDto): Promise<InitiateResetPasswordResponseDto> {
        const email: EmailAddress = EmailAddress.create(request.email);

        const doesUserExist = await this.userRepository.exists({ email: request.email });
        AssertUtil.isTrue(
            doesUserExist,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'User not found!',
            }),
        );

        const user: User = await this.userRepository.findOne({ email: email.getValue });

        // TODO: Emit an event and let the event handle the dispatching of email
        const resetPassordToken: string = TokenUtil.generateUrlSafeToken();
        const fiveHoursTtl: number = 5 * 60 * 60;
        await this.cache.set(`${CacheKeysPrefix.RESET_PASSWORD}:${user.getId}`, resetPassordToken, fiveHoursTtl);

        const resetPasswordLink: string = `${this.config.getString(ConfigKeys.CLIENT_URL)}reset-password?userId=${user.getId}?token=${resetPassordToken}`;
        await this.sendEmailNotificationUseCase.execute({
            subject: 'Reset Password!',
            senderEmail: this.config.getString(ConfigKeys.MAIL_FROM),
            recipientEmail: user.getEmail,
            template: 'reset-password',
            templateData: { firstName: user.getFirstName, cta: { link: resetPasswordLink, text: 'Reset Password' } },
        });

        this.logger.log(`User with id: ${user.getId} initiated a reset password`, InitiateResetPasswordUseCase.name);
    }
}
