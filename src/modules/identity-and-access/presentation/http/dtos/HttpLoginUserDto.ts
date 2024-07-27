import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpLoggedInUser } from '../auth/HttpAuthService';

export class HttpLoginUserRequestDto extends HttpRequestDto {
    @ApiProperty({
        type: 'string',
        required: true,
        description: 'Unique identification of a user (email address or username)',
    })
    @IsNotEmpty()
    public uid: string;

    @ApiProperty({ type: 'string', required: true })
    @IsNotEmpty()
    public password: string;
}

export class HttpLoginUserDto implements HttpLoggedInUser {
    @ApiProperty({ type: String, format: 'uuid', example: 'eb89b392-900b-4164-89d0-a317e2bddedb' })
    id: string;

    @ApiProperty({ type: String, description: 'JWT access token' })
    accessToken: string;
}

export class HttpLoginUserResponseDto extends HttpResponseDto<HttpLoginUserDto> {
    @ApiProperty({ type: HttpLoginUserDto })
    public data: HttpLoginUserDto;
}
