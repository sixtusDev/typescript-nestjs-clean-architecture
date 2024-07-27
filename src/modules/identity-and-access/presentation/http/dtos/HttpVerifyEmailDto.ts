import {
    VerifyEmailRequestDto,
    VerifyEmailResponseDto,
} from '@identity-and-access/core/usecases/commands/dtos/VerifyEmailDto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { IsString } from 'class-validator';

export class HttpVerifyEmailRequestDto extends HttpRequestDto implements VerifyEmailRequestDto {
    @ApiProperty({ required: true, type: String, format: 'uuid', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
    @IsString()
    public userId: string;

    @ApiProperty({ required: true, type: String })
    @IsString()
    public token: string;
}

export class HttpVerifyEmailResponseDto extends HttpResponseDto<VerifyEmailResponseDto> {}
