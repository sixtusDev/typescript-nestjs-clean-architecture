import { Entity, EntityProps } from '@shared/core/entities/Entity';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { IsNotEmpty } from 'class-validator';

interface CreateUserRoleProps extends EntityProps {
    userId: UniqueId;
    roleId: UniqueId;
}

export class UserRole extends Entity {
    @IsNotEmpty()
    userId: UniqueId;

    @IsNotEmpty()
    roleId: UniqueId;

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

        this.userId = props.userId;
        this.roleId = props.roleId;
    }

    public get getUserId(): UniqueId {
        return this.userId;
    }

    public get getRoleId(): UniqueId {
        return this.roleId;
    }

    public static create(props: CreateUserRoleProps): UserRole {
        const userRole: UserRole = new UserRole(props);

        userRole.validate();

        return userRole;
    }
}
