import {
    ChangePasswordRequestDto,
    ChangePasswordResponseDto,
} from '@identity-and-access/core/usecases/commands/dtos/ChangePasswordDto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { IsString, IsStrongPassword } from 'class-validator';

export class HttpChangePasswordRequestDto extends HttpRequestDto implements ChangePasswordRequestDto {
    @ApiProperty({ required: true, type: String })
    @IsString()
    public readonly oldPassword: string;

    @ApiProperty({ required: true, type: String })
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    public readonly newPassword: string;

    @ApiHideProperty()
    public readonly userId: string;
}

export class HttpChangePasswordResponseDto extends HttpResponseDto<ChangePasswordResponseDto> {}
