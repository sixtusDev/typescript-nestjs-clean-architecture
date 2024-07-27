import { Entity, EntityProps } from '@shared/core/entities/Entity';
import { Nullable } from '@shared/core/types/UtilityTypes';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { IsArray, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

interface CreateUserProfileProps extends EntityProps {
    userId: UniqueId;
    lastActiveAt: Date;
    bio?: string;
    profilePictureurl?: string;
    learningStreak?: number;
    xpPoints?: number;
    preferredLearningTimes?: Date[];
    dateOfBirth?: Date;
}

interface UpdateUserProfileProps {
    bio?: string;
    profilePictureUrl?: string;
    preferredLearningTimes?: Date[];
    dateOfBirth?: Date;
    updatedBy?: string;
}

export class UserProfile extends Entity {
    @IsNotEmpty()
    private readonly userId: UniqueId;

    @IsOptional()
    @IsString()
    @MinLength(3)
    private bio: Nullable<string>;

    // TODO: Add decorator to check against file type
    @IsOptional()
    private profilePictureUrl: Nullable<string>;

    @IsOptional()
    @IsInt()
    private learningStreak: number;

    @IsOptional()
    @IsInt()
    private xpPoints: number;

    @IsOptional()
    @IsArray()
    @IsDate({ each: true })
    private preferredLearningTimes: Nullable<Date[]>;

    @IsDate()
    private lastActiveAt: Date;

    @IsOptional()
    @IsDate()
    private dateOfBirth: Nullable<Date>;

    private constructor(props: CreateUserProfileProps) {
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
        this.learningStreak = props.learningStreak;
        this.xpPoints = props.xpPoints;
        this.lastActiveAt = props.lastActiveAt;
        this.dateOfBirth = props.dateOfBirth ?? null;
        this.profilePictureUrl = props.profilePictureurl ?? null;
        this.preferredLearningTimes = props.preferredLearningTimes ?? [];
        if (this.bio) {
            this.bio = props.bio;
        }
    }

    public get getUserId(): UniqueId {
        return this.userId;
    }

    public get getBio(): string {
        return this.bio;
    }

    public get getProfilePictureUrl(): Nullable<string> {
        return this.profilePictureUrl;
    }

    public get getLearningStreak(): number {
        return this.learningStreak;
    }

    public get getXpPoints(): number {
        return this.xpPoints;
    }

    public get getPreferredLearningTimes(): Nullable<Date[]> {
        return this.preferredLearningTimes;
    }

    public get getLastActiveAt(): Date {
        return this.lastActiveAt;
    }

    public get getDateOfBirth(): Nullable<Date> {
        return this.dateOfBirth;
    }

    public update(props: UpdateUserProfileProps): void {
        const currentDate: Date = new Date();
        const updatedBy = props.updatedBy ?? null;

        if (props.bio) {
            this.bio = props.bio;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        if (props.dateOfBirth) {
            this.dateOfBirth = props.dateOfBirth;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        if (props.preferredLearningTimes) {
            this.preferredLearningTimes = props.preferredLearningTimes;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        if (props.profilePictureUrl) {
            this.profilePictureUrl = props.profilePictureUrl;
            this.updatedAt = currentDate;
            this.updatedBy = updatedBy;
        }

        this.validate();
    }

    public static create(props: CreateUserProfileProps): UserProfile {
        const userProfile: UserProfile = new UserProfile(props);
        userProfile.validate();

        return userProfile;
    }
}
