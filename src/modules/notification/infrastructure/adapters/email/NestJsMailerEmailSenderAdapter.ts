import { EmailSenderPort } from '@notification/core/domain/ports/EmailSenderPort';
import { EmailNotification } from '@notification/core/domain/value-objects/EmailNotification';
import { MailerService } from '@nestjs-modules/mailer';

export class NestJsMailerEmailSenderAdapter implements EmailSenderPort {
    constructor(private readonly mailService: MailerService) {}

    public async send(emailNotification: EmailNotification<unknown>): Promise<void> {
        await this.mailService.sendMail({
            from: emailNotification.getSenderEmail.getValue,
            to: emailNotification.getRecipientEmail.getValue,
            subject: emailNotification.getSubject,
            template: emailNotification.getTemplate,
            context: emailNotification.getTemplateData,
        });
    }
}
