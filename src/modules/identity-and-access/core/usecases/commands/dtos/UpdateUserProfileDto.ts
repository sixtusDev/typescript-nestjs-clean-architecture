import { FileDate } from '@shared/core/ports/FileStoragePort';

export interface UpdateUserProfileRequestDto {
    readonly userId: string;
    readonly bio?: string;
    readonly profilePicture?: FileDate;
    readonly preferredLearningTimes?: Date[];
    readonly dateOfBirth?: Date;
}

export type UpdateUserProfileResponseDto = void;
