import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { Role, RoleNames } from '@identity-and-access/core/domain/entities/Role';
import { Role as PrismaRole } from '@prisma/client';

export class PrismaRoleMapper {
    public static toDomainEntity(prismaRole: PrismaRole): Role {
        const role: Role = Role.create({
            id: UniqueId.create(prismaRole.id),
            name: prismaRole.name as RoleNames,
            description: prismaRole.description,
            createdAt: prismaRole.createdAt,
            createdBy: prismaRole.createdBy,
            updatedAt: prismaRole.updatedAt,
            updatedBy: prismaRole.updatedBy,
            deletedAt: prismaRole.deletedAt,
            deletedBy: prismaRole.deletedBy,
        });

        return role;
    }

    public static toDomainEntities(prismaRoles: PrismaRole[]): Role[] {
        const roles: Role[] = prismaRoles.map((pr) => this.toDomainEntity(pr));

        return roles;
    }

    public static toPrismaEntity(role: Role): PrismaRole {
        const prismaRole: PrismaRole = {
            id: role.getId.getValue,
            name: role.getName,
            description: role.getDescription,
            createdAt: role.getCreatedAt,
            createdBy: role.getCreatedBy,
            updatedAt: role.getUpdatedAt,
            updatedBy: role.getUpdatedBy,
            deletedAt: role.getDeletedAt,
            deletedBy: role.getDeletedBy,
        };

        return prismaRole;
    }

    public static toPrismaEntities(roles: Role[]): PrismaRole[] {
        const prismaRoles: PrismaRole[] = roles.map((role) => this.toPrismaEntity(role));

        return prismaRoles;
    }
}
