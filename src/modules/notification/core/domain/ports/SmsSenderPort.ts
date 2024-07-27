export interface SmsSenderPort {
    // TODO: Change any to sms value object after implementing it.
    send(smsNotification: any): Promise<void>;
}
