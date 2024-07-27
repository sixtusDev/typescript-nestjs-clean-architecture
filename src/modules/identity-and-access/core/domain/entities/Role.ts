import { Entity, EntityProps } from '@shared/core/entities/Entity';
import { Nullable } from '@shared/core/types/UtilityTypes';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum RoleNames {
    USER = 'USER',
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    CONTENT_CREATOR = 'CONTENT_CREATOR',
}

interface CreateUserRoleProps extends EntityProps {
    name: RoleNames;
    description?: string;
}

export class Role extends Entity {
    @IsEnum(RoleNames)
    name: RoleNames;

    @IsOptional()
    @IsString()
    description: Nullable<string>;

    private constructor(props: CreateUserRoleProps) {
        super({
            id: props.id,
            createdAt: props.createdAt,
            createdBy: props.createdBy,
            updatedAt: props.updatedAt,
            updatedBy: props.updatedBy,
            deletedAt: props.deletedAt,
            deletedBy: props.deletedBy,
        });

        this.name = props.name;
        this.description = props.description ?? null;
    }

    public get getName(): RoleNames {
        return this.name;
    }

    public get getDescription(): string {
        return this.description;
    }

    public static create(props: CreateUserRoleProps): Role {
        const userRole: Role = new Role(props);

        userRole.validate();

        return userRole;
    }
}
