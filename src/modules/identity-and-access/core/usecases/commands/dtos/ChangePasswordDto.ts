export interface ChangePasswordRequestDto {
    readonly userId: string;
    readonly oldPassword: string;
    readonly newPassword: string;
}

export type ChangePasswordResponseDto = void;
