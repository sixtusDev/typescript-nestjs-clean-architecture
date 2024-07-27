import { IsEmail } from 'class-validator';
import { ValueObject } from './ValueObject';

export class EmailAddress extends ValueObject {
    @IsEmail()
    private readonly value: string;

    private constructor(value: string) {
        super();

        this.value = value;
    }

    public get getValue(): string {
        return this.value;
    }

    public static create(value: string): EmailAddress {
        const email: EmailAddress = new EmailAddress(value);
        email.validate();

        return email;
    }
}
