import { compare, genSalt, hash } from 'bcryptjs';
import { ValueObject } from '@shared/core/value-objects/ValueObject';
import { IsBoolean, IsStrongPassword } from 'class-validator';

export class UserPassword extends ValueObject {
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    private value: string;

    @IsBoolean()
    private isHashed: boolean;

    private constructor(passowrd: string, isHashed: boolean) {
        super();

        this.value = passowrd;
        this.isHashed = isHashed;
    }

    public get getValue() {
        return this.value;
    }

    public get getIsHashed() {
        return this.isHashed;
    }

    public async hashPassword(): Promise<void> {
        const salt: string = await genSalt();
        this.value = await hash(this.value, salt);
        this.isHashed = true;

        this.validate();
    }

    public async comparePasswords(password: string): Promise<boolean> {
        return compare(password, this.value);
    }

    public static create(value: string, isHashed?: boolean) {
        if (!isHashed) {
            const userPassword: UserPassword = new UserPassword(value, isHashed ?? false);
            userPassword.validate();

            return userPassword;
        }

        const userPassword = new UserPassword(value, isHashed);

        return userPassword;
    }
}
