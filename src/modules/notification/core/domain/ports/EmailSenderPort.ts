import { EmailNotification } from '../value-objects/EmailNotification';

export interface EmailSenderPort {
    send(emailNotification: EmailNotification<unknown>): Promise<void>;
}
