import { UseCase } from '@shared/core/usecases/UseCase';
import { SendEmailNotificationRequestDto, SendEmailNotificationResponseDto } from './dtos/SendEmailNotificationDto';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { TaskQueuePort } from '@shared/core/ports/TaskQueuePort';
import { EmailNotification } from '../domain/value-objects/EmailNotification';
import { EmailAddress } from '@shared/core/value-objects/EmailAddress';
import { TaskNames } from '../constants/TaskNames';

export class SendEmailNotificationUseCase<TTemplateData>
    implements UseCase<SendEmailNotificationRequestDto<TTemplateData>, SendEmailNotificationResponseDto>
{
    constructor(
        private readonly taskQueue: TaskQueuePort,
        private readonly logger: LoggerPort,
    ) {}

    public async execute(request?: SendEmailNotificationRequestDto<TTemplateData>): Promise<void> {
        const emailNotification = EmailNotification.create({
            senderEmail: EmailAddress.create(request.senderEmail),
            recipientEmail: EmailAddress.create(request.recipientEmail),
            subject: request.subject,
            template: request.template,
            templateData: request.templateData,
        });

        await this.taskQueue.addTask(TaskNames.SEND_EMAIL, emailNotification);

        this.logger.log(
            `Send email notification to ${emailNotification.getRecipientEmail} task queued`,
            SendEmailNotificationUseCase.name,
        );
    }
}
