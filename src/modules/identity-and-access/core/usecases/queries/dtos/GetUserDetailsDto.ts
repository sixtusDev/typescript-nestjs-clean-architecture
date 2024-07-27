import { User } from '@identity-and-access/core/domain/entities/User';
import { UserProfile } from '@identity-and-access/core/domain/entities/UserProfile';
import { Exclude, Expose, plainToClass } from 'class-transformer';

export interface GetUserDetailsRequestDto {
    readonly userId: string;
}

@Exclude()
export class UserProfileResponseDto {
    @Expose()
    public readonly id: string;

    @Expose()
    public readonly bio: string;

    @Expose()
    public readonly lastActiveAt: string;

    @Expose()
    public readonly dateOfBirth: string;

    @Expose()
    public readonly profilePictureUrl: string;

    @Expose()
    public readonly preferredLearningTime: string[];

    @Expose()
    public readonly learningStreak: number;

    @Expose()
    public readonly xpPoints: number;
}

@Exclude()
export class GetUserDetailsResponseDto {
    @Expose()
    public readonly id: string;

    @Expose()
    public readonly firstName: string;

    @Expose()
    public readonly lastName: string;

    @Expose()
    public readonly email: string;

    @Expose()
    public readonly isEmailVerified: string;

    @Expose()
    public readonly profile: UserProfileResponseDto;

    public static newFromUser(userDetails: { user: User; profile: UserProfile }): GetUserDetailsResponseDto {
        const { profile, user } = userDetails;

        return plainToClass(GetUserDetailsResponseDto, {
            ...user,
            id: user.getId.getValue,
            profile: plainToClass(UserProfileResponseDto, {
                ...profile,
                id: profile.getId.getValue,
            }),
        });
    }
}
