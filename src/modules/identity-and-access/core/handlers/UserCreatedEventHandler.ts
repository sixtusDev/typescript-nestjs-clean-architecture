import { EventHandler } from '@shared/core/handlers/EventHandler';
import { UserCreatedEvent } from '../domain/events/UserCreatedEvent';
import { CachePort } from '@shared/core/ports/CachePort';
import { TokenUtil } from '@shared/core/utils/TokenUtil';
import { SendEmailNotificationUseCase } from '@notification/core/usecases/SendEmailNotificationUseCase';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { CacheKeysPrefix } from '../domain/constants/CacheKeysPrefix';

export class UserCreatedEventHandler implements EventHandler<UserCreatedEvent> {
    constructor(
        private readonly sendEmailNotificationUseCase: SendEmailNotificationUseCase<{
            firstName: string;
            cta: { link: string; text: string };
        }>,
        private readonly cache: CachePort,
        private readonly logger: LoggerPort,
        private readonly config: ConfigPort,
    ) {}

    async handle(event: UserCreatedEvent): Promise<void> {
        const verificationToken: string = TokenUtil.generateUrlSafeToken();
        const verificationLink: string = `${this.config.getString(ConfigKeys.CLIENT_URL)}verify?token=${verificationToken}?userId=${event.user.getId}`;

        const fiveHoursTtl: number = 5 * 60 * 60;
        await this.cache.set(`${CacheKeysPrefix.VERIFY_EMAIL}:${event.user.getId}`, verificationToken, fiveHoursTtl);

        await this.sendEmailNotificationUseCase.execute({
            subject: 'Welcome to TypeScript Nestjs Clean Architecture!',
            senderEmail: this.config.getString(ConfigKeys.MAIL_FROM),
            recipientEmail: event.user.getEmail,
            template: 'welcome',
            templateData: {
                firstName: event.user.getFirstName,
                cta: { text: 'Verify your Email', link: verificationLink },
            },
        });

        this.logger.log(`User created event handled!`, UserCreatedEventHandler.name);
    }
}
