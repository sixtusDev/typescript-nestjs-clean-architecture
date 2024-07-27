import { RoleNames } from '@identity-and-access/core/domain/entities/Role';

export interface CreateUserRequestDto {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly password: string;
    readonly role: RoleNames;
}

export type CreateUserResponseDto = void;
