import {
    InitiateResetPasswordRequestDto,
    InitiateResetPasswordResponseDto,
} from '@identity-and-access/core/usecases/commands/dtos/InitiateResetPasswordDto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { IsEmail } from 'class-validator';

export class HttpInitiateResetPasswordRequestDto extends HttpRequestDto implements InitiateResetPasswordRequestDto {
    @ApiProperty({ type: 'string', required: true, example: 'johndoe@getnada.com' })
    @IsEmail()
    public email: string;
}

export class HttpInitiateResetPasswordResponseDto extends HttpResponseDto<InitiateResetPasswordResponseDto> {}
