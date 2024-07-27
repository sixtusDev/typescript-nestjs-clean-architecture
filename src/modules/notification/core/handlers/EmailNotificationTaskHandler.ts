import { TaskHandler } from '@shared/core/handlers/TaskHandler';
import { EmailSenderPort } from '../domain/ports/EmailSenderPort';
import { TaskQueuePort } from '@shared/core/ports/TaskQueuePort';
import { EmailNotification, EmailNotificationProps } from '../domain/value-objects/EmailNotification';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { TaskNames } from '../constants/TaskNames';

export class EmailNotificationTaskHandler implements TaskHandler {
    public readonly taskName: string = TaskNames.SEND_EMAIL;

    constructor(
        private readonly emailSender: EmailSenderPort,
        private readonly taskQueue: TaskQueuePort,
        private readonly logger: LoggerPort,
    ) {}

    async handle<TTask>(emailNotificationDto: TTask): Promise<void> {
        const emailNotification = EmailNotification.create(emailNotificationDto as EmailNotificationProps<unknown>);
        await this.emailSender.send(emailNotification);
        this.logger.log(
            `Email successfully sent to ${emailNotification.getRecipientEmail}`,
            EmailNotificationTaskHandler.name,
        );
    }

    setup(): void {
        this.taskQueue.processTask<EmailNotification<unknown>>(this.taskName, this.handle.bind(this));
    }
}
