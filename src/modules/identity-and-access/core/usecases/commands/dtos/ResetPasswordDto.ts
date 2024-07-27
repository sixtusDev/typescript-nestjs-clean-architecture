export interface ResetPasswordRequestDto {
    readonly newPassword: string;
    readonly userId: string;
    readonly token: string;
}

export type ResetPasswordResponseDto = void;
