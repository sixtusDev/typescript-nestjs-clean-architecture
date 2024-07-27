import { RepositoryFindOptions } from '@shared/core/persistence/RepositoryOptions';
import { Nullable } from '@shared/core/types/UtilityTypes';
import { User } from '@identity-and-access/core/domain/entities/User';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { PrismaClient, User as PrismaUser } from '@prisma/client';
import { PrismaUserMapper } from '../mappers/PrismaUserMapper';

export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
    constructor(private readonly prisma: PrismaClient) {}

    public async findOne(
        by: { id?: string; email?: string; username?: string },
        options?: RepositoryFindOptions,
    ): Promise<Nullable<User>> {
        const prismaUser: Nullable<PrismaUser> = await this.prisma.user.findUnique({
            where: {
                id: by.id,
                email: by.email,
                username: by.username,
                ...(!options?.includeDeleted && { deletedAt: null }),
            },
        });

        let user: Nullable<User> = null;

        if (prismaUser) user = PrismaUserMapper.toDomainEntity(prismaUser);

        return user;
    }

    public async createOne(user: User, transactionRef?: PrismaClient): Promise<void> {
        const prisma: PrismaClient = transactionRef ?? this.prisma;

        const prismaUser: PrismaUser = PrismaUserMapper.toPrismaEntity(user);

        await prisma.user.create({ data: prismaUser });
    }

    public async updateOne(user: User, transactionRef?: PrismaClient): Promise<void> {
        const prisma: PrismaClient = transactionRef ?? this.prisma;

        const prismaUser: PrismaUser = PrismaUserMapper.toPrismaEntity(user);

        await prisma.user.update({ where: { id: user.getId.getValue }, data: prismaUser });
    }

    public async exists(
        by: { id?: string; email?: string; username?: string },
        options?: RepositoryFindOptions,
    ): Promise<boolean> {
        const count: number = await this.prisma.user.count({
            where: {
                id: by.id,
                email: by.email,
                username: by.username,
                ...(!options?.includeDeleted && { deletedAt: null }),
            },
        });

        return !!count;
    }
}
