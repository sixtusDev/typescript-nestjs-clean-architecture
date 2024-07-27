import { Entity, EntityProps } from '@shared/core/entities/Entity';
import { IsBoolean, IsEmail, IsString, MinLength } from 'class-validator';
import { UserPassword } from '../value-objects/UserPassword';
import { UniqueId } from '@shared/core/value-objects/UniqueId';

interface CreateUserProps extends EntityProps {
    id?: UniqueId;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: UserPassword;
    isEmailVerified: boolean;
}

interface EditUserProps {
    firstName?: string;
    lastName?: string;
    updatedBy?: string;
    isEmailVerified?: boolean;
    password?: UserPassword;
}

interface DeleteUserProps {
    deletedBy?: string;
}

export class User extends Entity {
    @IsString()
    private firstName: string;

    @IsString()
    private lastName: string;

    @IsString()
    @MinLength(3)
    private username: string;

    @IsEmail()
    private readonly email: string;

    private password: UserPassword;

    @IsBoolean()
    private isEmailVerified: boolean;

    private constructor(props: CreateUserProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            createdBy: props.createdBy,
            updatedAt: props.updatedAt,
            updatedBy: props.updatedBy,
            deletedAt: props.deletedAt,
            deletedBy: props.deletedBy,
        });

        this.firstName = props.firstName;
        this.lastName = props.lastName;
        this.username = props.username;
        this.email = props.email;
        this.password = props.password;
        this.isEmailVerified = props.isEmailVerified;
    }

    public get getFirstName(): string {
        return this.firstName;
    }

    public get getLastName(): string {
        return this.lastName;
    }

    public get getUsername(): string {
        return this.username;
    }

    public get getEmail(): string {
        return this.email;
    }

    public get getPassword(): UserPassword {
        return this.password;
    }

    public get getIsEmailVerified(): boolean {
        return this.isEmailVerified;
    }

    public edit(props: EditUserProps): void {
        const currentDate: Date = new Date();
        const updatedBy = props.updatedBy ?? null;

        if (props.firstName) {
            this.firstName = props.firstName;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        if (props.lastName) {
            this.lastName = props.lastName;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        if (props.isEmailVerified) {
            this.isEmailVerified = props.isEmailVerified;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        if (props.password) {
            this.password = props.password;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        this.validate();
    }

    public delete(props: DeleteUserProps): void {
        this.deletedAt = new Date();
        this.deletedBy = props.deletedBy ?? null;

        this.validate();
    }

    public static create(props: CreateUserProps): User {
        const user: User = new User(props);
        user.validate();

        return user;
    }
}
