import { PrismaClient, Role as PrismaRole } from '@prisma/client';
import { RoleNames, Role } from '@identity-and-access/core/domain/entities/Role';
import { RoleRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/RoleRepositoryPort';
import { PrismaRoleMapper } from '../mappers/PrismaRoleMapper';

export class PrismaRoleRepositoryAdapter implements RoleRepositoryPort {
    constructor(private readonly prisma: PrismaClient) {}

    public async findOne(by: { id?: string; name?: RoleNames }): Promise<Role> {
        const prismaRole: PrismaRole = await this.prisma.role.findUnique({
            where: { id: by.id, name: by.name },
        });

        return PrismaRoleMapper.toDomainEntity(prismaRole);
    }

    public async exists(by: { id?: string; name?: RoleNames }): Promise<boolean> {
        const count: number = await this.prisma.role.count({ where: { id: by.id, name: by.name } });

        return !!count;
    }
}
