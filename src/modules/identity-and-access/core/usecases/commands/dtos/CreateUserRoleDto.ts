import { RoleNames } from '@identity-and-access/core/domain/entities/Role';

export interface CreateUserRoleRequestDto {
    readonly userId: string;
    readonly roleName: RoleNames;
}

export type CreateUserRoleResponseDto = void;
