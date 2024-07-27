import { IsBase64, IsObject, IsOptional, IsString } from 'class-validator';
import { Notification } from './Notification';
import { EmailAddress } from '@shared/core/value-objects/EmailAddress';

export interface EmailNotificationProps<TTemplateData> {
    recipientEmail: EmailAddress;
    senderEmail: EmailAddress;
    subject: string;
    template: string;
    templateData?: TTemplateData;
    attachment?: string;
}

export class EmailNotification<TTemplateData> extends Notification {
    private readonly recipientEmail: EmailAddress;

    private readonly senderEmail: EmailAddress;

    @IsString()
    private readonly subject: string;

    @IsString()
    private readonly template: string;

    @IsObject()
    private readonly templateData?: TTemplateData;

    @IsOptional()
    @IsBase64()
    private attachment?: string;

    private constructor(props: EmailNotificationProps<TTemplateData>) {
        super();

        this.recipientEmail = props.recipientEmail;
        this.senderEmail = props.senderEmail;
        this.subject = props.subject;
        this.template = props.template;
        this.templateData = props.templateData;
        this.attachment = props.attachment;
    }

    public get getRecipientEmail(): EmailAddress {
        return this.recipientEmail;
    }

    public get getSenderEmail(): EmailAddress {
        return this.senderEmail;
    }

    public get getSubject(): string {
        return this.subject;
    }

    public get getAttachment(): string {
        return this.attachment;
    }

    public get getTemplate() {
        return this.template;
    }

    public get getTemplateData() {
        return this.templateData;
    }

    public static create<TTemplateData>(
        props: EmailNotificationProps<TTemplateData>,
    ): EmailNotification<TTemplateData> {
        const emailNotification: EmailNotification<TTemplateData> = new EmailNotification(props);
        emailNotification.validate();

        return emailNotification;
    }
}
