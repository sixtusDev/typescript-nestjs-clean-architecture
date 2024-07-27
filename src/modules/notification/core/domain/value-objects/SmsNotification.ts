import { IsPhoneNumber, IsString } from 'class-validator';
import { Notification } from './Notification';

interface SmsNotificationProps {
    recipientPhoneNumber: string;
    message: string;
}

export class SmsNotification extends Notification {
    @IsPhoneNumber()
    private readonly recipientPhoneNumber: string;

    @IsString()
    private readonly message: string;

    private constructor(props: SmsNotificationProps) {
        super();

        this.recipientPhoneNumber = props.recipientPhoneNumber;
        this.message = props.message;
    }

    public get getRecipientPhoneNumber() {
        return this.recipientPhoneNumber;
    }

    public get getMessage() {
        return this.message;
    }

    public static create(props: SmsNotificationProps) {
        const smsNotification = new SmsNotification(props);
        smsNotification.validate();

        return smsNotification;
    }
}
