import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { UserProfile } from '@identity-and-access/core/domain/entities/UserProfile';
import { UserProfile as PrismaUserProfile } from '@prisma/client';

export class PrismaUserProfileMapper {
    public static toDomainEntity(prismaUserProfile: PrismaUserProfile): UserProfile {
        const userProfile: UserProfile = UserProfile.create({
            id: UniqueId.create(prismaUserProfile.id),
            userId: UniqueId.create(prismaUserProfile.userId),
            bio: prismaUserProfile.bio,
            profilePictureurl: prismaUserProfile.profilePictureUrl,
            learningStreak: prismaUserProfile.learningStreak,
            xpPoints: prismaUserProfile.xpPoints,
            preferredLearningTimes: prismaUserProfile.preferredLearningTimes,
            lastActiveAt: prismaUserProfile.lastActiveAt,
            dateOfBirth: prismaUserProfile.dateOfBirth,
            createdAt: prismaUserProfile.createdAt,
            createdBy: prismaUserProfile.createdBy,
            updatedAt: prismaUserProfile.updatedAt,
            updatedBy: prismaUserProfile.updatedBy,
            deletedAt: prismaUserProfile.deletedAt,
            deletedBy: prismaUserProfile.deletedBy,
        });

        return userProfile;
    }

    public static toDomainEntities(prismaUserProfiles: PrismaUserProfile[]): UserProfile[] {
        const userProfiles: UserProfile[] = prismaUserProfiles.map((up) => this.toDomainEntity(up));

        return userProfiles;
    }

    public static toPrismaEntity(userProfile: UserProfile): PrismaUserProfile {
        const prismaUserProfile: PrismaUserProfile = {
            id: userProfile.getId.getValue,
            userId: userProfile.getUserId.getValue,
            bio: userProfile.getBio,
            profilePictureUrl: userProfile.getProfilePictureUrl,
            learningStreak: userProfile.getLearningStreak,
            xpPoints: userProfile.getXpPoints,
            preferredLearningTimes: userProfile.getPreferredLearningTimes,
            lastActiveAt: userProfile.getLastActiveAt,
            dateOfBirth: userProfile.getDateOfBirth,
            createdAt: userProfile.getCreatedAt,
            createdBy: userProfile.getCreatedBy,
            updatedAt: userProfile.getUpdatedAt,
            updatedBy: userProfile.getUpdatedBy,
            deletedAt: userProfile.getDeletedAt,
            deletedBy: userProfile.getDeletedBy,
        };

        return prismaUserProfile;
    }

    public static toPrismaEntities(userProfiles: UserProfile[]): PrismaUserProfile[] {
        const prismaEntities: PrismaUserProfile[] = userProfiles.map((up) => this.toPrismaEntity(up));

        return prismaEntities;
    }
}
