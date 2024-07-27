export interface VerifyEmailRequestDto {
    readonly userId: string;
    readonly token: string;
}

export type VerifyEmailResponseDto = void;
