import {
    UpdateUserProfileRequestDto,
    UpdateUserProfileResponseDto,
} from '@identity-and-access/core/usecases/commands/dtos/UpdateUserProfileDto';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { FileDate } from '@shared/core/ports/FileStoragePort';
import { HttpRequestDto } from '@shared/presentation/http/dtos/HttpRequestDto';
import { HttpResponseDto } from '@shared/presentation/http/dtos/HttpResponseDto';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class HttpUpdateUserProfileRequestDto extends HttpRequestDto implements UpdateUserProfileRequestDto {
    @ApiProperty({ required: false, type: String })
    @IsOptional()
    @IsString()
    public readonly bio?: string;

    @ApiProperty({
        required: false,
        type: [String],
        format: 'date-time',
        isArray: true,
        description: 'Array of ISO 8601 date strings',
        example: ['2024-07-10T15:30:00Z', '2024-07-11T09:45:00Z'],
    })
    @IsOptional()
    @IsString({ each: true }) // TODO: Add a custom decorator that checks for valid dates.
    // TODO: Modify transform
    // @Transform(({ value }) => (value ? value?.split(',') : []))
    public readonly preferredLearningTimes?: Date[];

    @ApiProperty({
        required: false,
        type: String,
        format: 'date-time',
        example: '2024-07-10T21:13:49.387Z',
        description: 'ISO 8601 date string',
    })
    @IsOptional()
    @IsDateString()
    public readonly dateOfBirth?: Date;

    @ApiProperty({ required: false, type: String, format: 'binary' })
    @IsOptional()
    public readonly profilePicture?: FileDate;

    @ApiHideProperty()
    public readonly userId: string;
}

export class HttpUpdateUserProfileResponseDto extends HttpResponseDto<UpdateUserProfileResponseDto> {}
