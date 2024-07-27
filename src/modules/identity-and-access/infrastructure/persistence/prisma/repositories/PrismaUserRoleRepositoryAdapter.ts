import { PrismaClient, UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '@identity-and-access/core/domain/entities/UserRole';
import { UserRoleRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRoleRepositoryPort';
import { PrismaUserRoleMapper } from '../mappers/PrismaUserRoleMapper';
import { RepositoryFindOptions } from '@shared/core/persistence/RepositoryOptions';

export class PrismaUserRoleRepositoryAdapter implements UserRoleRepositoryPort {
    constructor(private readonly prisma: PrismaClient) {}

    public async findOne(by: { id?: string; userId?: string }, options: RepositoryFindOptions): Promise<UserRole> {
        const userRole: PrismaUserRole = await this.prisma.userRole.findUnique({
            where: { id: by.id, userId: by.userId, ...(!options?.includeDeleted && { deletedAt: null }) },
        });

        return PrismaUserRoleMapper.toDomainEntity(userRole);
    }

    public async updateOne(userRole: UserRole, transactionRef: PrismaClient): Promise<void> {
        const prisma: PrismaClient = transactionRef ?? this.prisma;

        const prismaUserRole: PrismaUserRole = PrismaUserRoleMapper.toPrismaEntity(userRole);

        await prisma.userRole.update({ where: { id: prismaUserRole.id }, data: prismaUserRole });
    }

    public async createOne(userRole: UserRole, transactionRef?: PrismaClient): Promise<void> {
        const prisma: PrismaClient = transactionRef ?? this.prisma;

        const prismaUserRole: PrismaUserRole = PrismaUserRoleMapper.toPrismaEntity(userRole);

        await prisma.userRole.create({ data: prismaUserRole });
    }

    public async exists(by: { id?: string; userId?: string }, options?: RepositoryFindOptions): Promise<boolean> {
        const count: number = await this.prisma.userRole.count({
            where: { id: by.id, userId: by.userId, ...(!options?.includeDeleted && { deletedAt: null }) },
        });

        return !!count;
    }
}
