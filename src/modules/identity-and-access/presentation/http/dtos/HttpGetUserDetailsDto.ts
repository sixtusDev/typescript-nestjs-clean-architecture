import {
    GetUserDetailsResponseDto,
    UserProfileResponseDto,
} from '@identity-and-access/core/usecases/queries/dtos/GetUserDetailsDto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';

class HttpUserProfileResponseDto extends HttpRequestDto implements UserProfileResponseDto {
    @ApiProperty({ type: String })
    public readonly id: string;

    @ApiProperty({ type: String })
    public readonly bio: string;

    @ApiProperty({ type: String })
    public readonly lastActiveAt: string;

    @ApiProperty({ type: String })
    public readonly dateOfBirth: string;

    @ApiProperty({ type: String })
    public readonly profilePictureUrl: string;

    @ApiProperty({ type: [String], format: 'date-time', isArray: true })
    public readonly preferredLearningTime: string[];

    @ApiProperty({ type: String })
    public readonly learningStreak: number;

    @ApiProperty({ type: String })
    public readonly xpPoints: number;
}

export class HttpUserDetailsResponseDto implements GetUserDetailsResponseDto {
    @ApiProperty({ type: String })
    public readonly id: string;

    @ApiProperty({ type: String })
    public readonly firstName: string;

    @ApiProperty({ type: String })
    public readonly lastName: string;

    @ApiProperty({ type: String, format: 'email' })
    public readonly email: string;

    @ApiProperty({ type: Boolean })
    public readonly isEmailVerified: string;

    @ApiProperty({ type: HttpUserProfileResponseDto })
    public readonly profile: HttpUserProfileResponseDto;
}

export class HttpGetUserDetailsResponseDto extends HttpResponseDto<HttpUserDetailsResponseDto> {
    @ApiProperty({ type: HttpUserDetailsResponseDto })
    public data: HttpUserDetailsResponseDto;
}
