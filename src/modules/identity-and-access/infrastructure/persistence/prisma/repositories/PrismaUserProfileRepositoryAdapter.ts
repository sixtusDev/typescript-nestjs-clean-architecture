import { PrismaClient, UserProfile as PrismaUserProfile } from '@prisma/client';
import { UserProfile } from '@identity-and-access/core/domain/entities/UserProfile';
import { UserProfileRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserProfileRepositoryPort';
import { PrismaUserProfileMapper } from '../mappers/PrismaUserProfileMapper';
import { RepositoryFindOptions } from '@shared/core/persistence/RepositoryOptions';

export class PrismaUserProfileRepositoryAdapter implements UserProfileRepositoryPort {
    constructor(private readonly prisma: PrismaClient) {}

    public async findOne(by: { id?: string; userId?: string }, options?: RepositoryFindOptions): Promise<UserProfile> {
        const userProfile: PrismaUserProfile = await this.prisma.userProfile.findUnique({
            where: { userId: by.userId, id: by.id, ...(!options?.includeDeleted && { deletedAt: null }) },
        });

        return PrismaUserProfileMapper.toDomainEntity(userProfile);
    }

    public async updateOne(userProfile: UserProfile, transactionRef: PrismaClient): Promise<void> {
        const prisma: PrismaClient = transactionRef ?? this.prisma;

        const prismaUserProfile: PrismaUserProfile = PrismaUserProfileMapper.toPrismaEntity(userProfile);

        await prisma.userProfile.update({ where: { id: userProfile.getId.getValue }, data: prismaUserProfile });
    }

    public async createOne(userProfile: UserProfile, transactionRef: PrismaClient): Promise<void> {
        const prisma: PrismaClient = transactionRef ?? this.prisma;

        const prismaUserProfile: PrismaUserProfile = PrismaUserProfileMapper.toPrismaEntity(userProfile);

        const { userId, ...rest } = prismaUserProfile;

        await prisma.userProfile.create({
            data: { ...rest, user: { connect: { id: userId } } },
        });
    }

    public async exists(by: { id?: string; userId?: string }, options?: RepositoryFindOptions): Promise<boolean> {
        const count: number = await this.prisma.userProfile.count({
            where: { id: by.id, userId: by.userId, ...(!options?.includeDeleted && { deletedAt: null }) },
        });

        return !!count;
    }
}
