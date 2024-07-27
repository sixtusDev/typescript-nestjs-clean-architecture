import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { User } from '@identity-and-access/core/domain/entities/User';
import { UserPassword } from '@identity-and-access/core/domain/value-objects/UserPassword';
import { User as PrismaUser } from '@prisma/client';

export class PrismaUserMapper {
    public static toDomainEntity(prismaUser: PrismaUser): User {
        console.log({ prismaUser });
        const user: User = User.create({
            id: UniqueId.create(prismaUser.id),
            email: prismaUser.email,
            firstName: prismaUser.firstName,
            lastName: prismaUser.lastName,
            username: prismaUser.username,
            password: UserPassword.create(prismaUser.password, true),
            isEmailVerified: prismaUser.isEmailVerified,
            createdAt: prismaUser.createdAt,
            createdBy: prismaUser.createdBy,
            updatedAt: prismaUser.updatedAt,
            updatedBy: prismaUser.updatedBy,
            deletedAt: prismaUser.deletedAt,
            deletedBy: prismaUser.deletedBy,
        });

        return user;
    }

    public static toDomainEntities(prismaUsers: PrismaUser[]): User[] {
        const users: User[] = prismaUsers.map((user) => this.toDomainEntity(user));

        return users;
    }

    public static toPrismaEntity(user: User): PrismaUser {
        const prismaUser: PrismaUser = {
            id: user.getId.getValue,
            email: user.getEmail,
            firstName: user.getFirstName,
            lastName: user.getLastName,
            username: user.getUsername,
            password: user.getPassword.getValue,
            isEmailVerified: user.getIsEmailVerified,
            createdAt: user.getCreatedAt,
            createdBy: user.getCreatedBy,
            updatedAt: user.getUpdatedAt,
            updatedBy: user.getUpdatedBy,
            deletedAt: user.getDeletedAt,
            deletedBy: user.getDeletedBy,
        };

        return prismaUser;
    }

    public static toPrismaEntities(users: User[]): PrismaUser[] {
        const prismaUsers: PrismaUser[] = users.map((user) => this.toPrismaEntity(user));

        return prismaUsers;
    }
}
