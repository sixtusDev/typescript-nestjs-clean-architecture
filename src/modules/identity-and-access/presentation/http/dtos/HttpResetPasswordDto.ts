import {
    ResetPasswordRequestDto,
    ResetPasswordResponseDto,
} from '@identity-and-access/core/usecases/commands/dtos/ResetPasswordDto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class HttpResetPasswordRequestDto extends HttpRequestDto implements ResetPasswordRequestDto {
    @ApiProperty({ required: true, type: String, format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsUUID()
    public userId: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    public token: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'Password1@',
        description:
            'Password should be a minimum of 8 characters and should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    public readonly newPassword: string;
}

export class HttpResetPasswordResponseDto extends HttpResponseDto<ResetPasswordResponseDto> {}
