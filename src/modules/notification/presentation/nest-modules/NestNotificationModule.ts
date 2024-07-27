import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { TaskHandlerRegistry } from '@shared/core/handlers/TaskHandlerRegistry';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { TaskQueuePort } from '@shared/core/ports/TaskQueuePort';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module, Provider } from '@nestjs/common';
import { NotificationDITokens } from '@notification/core/constants/NotificationDITokens';
import { EmailSenderPort } from '@notification/core/domain/ports/EmailSenderPort';
import { EmailNotificationTaskHandler } from '@notification/core/handlers/EmailNotificationTaskHandler';
import { SendEmailNotificationUseCase } from '@notification/core/usecases/SendEmailNotificationUseCase';
import { NestJsMailerEmailSenderAdapter } from '@notification/infrastructure/adapters/email/NestJsMailerEmailSenderAdapter';
import { join } from 'path';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';

const notificationProviders: Provider[] = [
    {
        provide: NotificationDITokens.EMAIL_SENDER,
        useFactory: (mailService: MailerService) => new NestJsMailerEmailSenderAdapter(mailService),
        inject: [MailerService],
    },
];

const useCaseProviders: Provider[] = [
    {
        provide: SendEmailNotificationUseCase,
        useFactory: (taskQueue: TaskQueuePort, logger: LoggerPort) =>
            new SendEmailNotificationUseCase(taskQueue, logger),
        inject: [CoreDITokens.TASK_QUEUE, CoreDITokens.LOGGER],
    },
];

const handlerProviders: Provider[] = [
    {
        provide: EmailNotificationTaskHandler,
        useFactory: (emailSender: EmailSenderPort, taskQueue: TaskQueuePort, logger: LoggerPort) =>
            new EmailNotificationTaskHandler(emailSender, taskQueue, logger),
        inject: [NotificationDITokens.EMAIL_SENDER, CoreDITokens.TASK_QUEUE, CoreDITokens.LOGGER],
    },
    {
        provide: TaskHandlerRegistry,
        useFactory: (emailNotificationJobHandler: EmailNotificationTaskHandler) => {
            const registry = new TaskHandlerRegistry();
            registry.registerHandler(emailNotificationJobHandler);

            return registry;
        },
        inject: [EmailNotificationTaskHandler],
    },
];

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: (config: ConfigPort) => {
                return {
                    preview: false,
                    verifyTransporters: true,
                    transport: {
                        host: config.getString(ConfigKeys.MAIL_HOST),
                        port: config.getInt(ConfigKeys.MAIL_PORT),
                        secure: true,
                        auth: {
                            user: config.getString(ConfigKeys.MAIL_USER),
                            pass: config.getString(ConfigKeys.MAIL_PASS),
                        },
                    },
                    template: {
                        dir: join(__dirname, '../../infrastructure/adapters/email/templates'),
                        adapter: new HandlebarsAdapter(),
                        options: { strict: true },
                    },
                    options: {
                        partials: {
                            dir: join(__dirname, '../../infrastructure/adapters/email/templates/partials'),
                            options: { strict: true },
                        },
                    },
                };
            },
            inject: [CoreDITokens.CONFIG],
        }),
    ],
    providers: [...notificationProviders, ...useCaseProviders, ...handlerProviders],
    exports: [SendEmailNotificationUseCase],
})
export class NestNotificationModule {}
