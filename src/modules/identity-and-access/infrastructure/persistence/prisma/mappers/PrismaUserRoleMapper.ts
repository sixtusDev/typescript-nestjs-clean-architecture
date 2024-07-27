import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { UserRole } from '@identity-and-access/core/domain/entities/UserRole';
import { UserRole as PrismaUserRole } from '@prisma/client';

export class PrismaUserRoleMapper {
    public static toDomainEntity(prismaUserRole: PrismaUserRole): UserRole {
        const userRole: UserRole = UserRole.create({
            id: UniqueId.create(prismaUserRole.id),
            userId: UniqueId.create(prismaUserRole.userId),
            roleId: UniqueId.create(prismaUserRole.roleId),
            createdAt: prismaUserRole.createdAt,
            createdBy: prismaUserRole.createdBy,
            updatedAt: prismaUserRole.updatedAt,
            updatedBy: prismaUserRole.updatedBy,
            deletedAt: prismaUserRole.deletedAt,
            deletedBy: prismaUserRole.deletedBy,
        });

        return userRole;
    }

    public static toDomainEntities(prismaUserRoles: PrismaUserRole[]): UserRole[] {
        const userRoles: UserRole[] = prismaUserRoles.map((pur) => this.toDomainEntity(pur));

        return userRoles;
    }

    public static toPrismaEntity(userRole: UserRole): PrismaUserRole {
        const prismaUserRole: PrismaUserRole = {
            id: userRole.getId.getValue,
            userId: userRole.getUserId.getValue,
            roleId: userRole.getRoleId.getValue,
            createdAt: userRole.getCreatedAt,
            createdBy: userRole.getCreatedBy,
            updatedAt: userRole.getUpdatedAt,
            updatedBy: userRole.getUpdatedBy,
            deletedAt: userRole.getDeletedAt,
            deletedBy: userRole.getDeletedBy,
        };

        return prismaUserRole;
    }

    public static toPrismaEntities(userRoles: UserRole[]): PrismaUserRole[] {
        const prismaUserRoles: PrismaUserRole[] = userRoles.map((ur) => this.toPrismaEntity(ur));

        return prismaUserRoles;
    }
}
