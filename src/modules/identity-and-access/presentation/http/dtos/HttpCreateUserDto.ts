import { RoleNames } from '@identity-and-access/core/domain/entities/Role';
import {
    CreateUserRequestDto,
    CreateUserResponseDto,
} from '@identity-and-access/core/usecases/commands/dtos/CreateUserDto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { IsEmail, IsEnum, IsString, IsStrongPassword } from 'class-validator';

export class HttpCreateUserRequestDto extends HttpRequestDto implements CreateUserRequestDto {
    @ApiProperty({ required: true, type: String, example: 'John' })
    @IsString()
    public readonly firstName: string;

    @ApiProperty({ required: true, type: String, example: 'Doe' })
    @IsString()
    public readonly lastName: string;

    @ApiProperty({ required: true, type: String, example: 'johndoe@getnada.com' })
    @IsEmail()
    public readonly email: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'Password1@',
        description:
            'Password should be a minimum of 8 characters and should contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    public readonly password: string;

    @ApiProperty({ required: true, enum: RoleNames, example: RoleNames.USER })
    @IsEnum(RoleNames)
    public readonly role: RoleNames;
}

export class HttpCreateUserResponseDto extends HttpResponseDto<CreateUserResponseDto> {}
