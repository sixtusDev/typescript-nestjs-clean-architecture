export class SendEmailNotificationRequestDto<TTemplateData> {
    public subject: string;
    public senderEmail: string;
    public recipientEmail: string;
    public template: string;
    public templateData: TTemplateData;
}

export type SendEmailNotificationResponseDto = void;
