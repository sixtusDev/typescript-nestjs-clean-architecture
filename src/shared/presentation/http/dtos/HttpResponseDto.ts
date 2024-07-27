import { ApiProperty } from '@nestjs/swagger';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { Nullable } from '@shared/core/types/UtilityTypes';

interface HttpResponseDtoProps<TDataDto> {
    message: string;
    code: number;
    data?: TDataDto;
}

interface CreateHttpResponseDtoProps<TDataDto> {
    message?: string;
    code?: number;
    data?: TDataDto;
}

export class HttpResponseDto<TDataDto> {
    @ApiProperty({ type: String, description: 'The message of the response' })
    public readonly message: string;

    @ApiProperty({ type: Number, description: 'The status code of the response', example: 200 })
    public readonly code: number;

    @ApiProperty({ type: String, format: 'date-time', description: 'Timestamp of the response' })
    public readonly timestamp: string;

    @ApiProperty({ nullable: true, type: 'object', description: 'The data of the response' })
    public readonly data: Nullable<TDataDto>;

    protected constructor(props: HttpResponseDtoProps<TDataDto>) {
        this.message = props.message;
        this.code = props.code;
        this.timestamp = new Date().toISOString();
        this.data = props.data ?? null;
    }

    public static success<TDataDto>({ message, code, data }: CreateHttpResponseDtoProps<TDataDto>) {
        const responseMessage: string = message ?? CoreCodeDescriptions.SUCCESS.message;
        const responseCode: number = code ?? CoreCodeDescriptions.SUCCESS.code;

        return new HttpResponseDto({ message: responseMessage, code: responseCode, data });
    }

    public static error<TDataDto>({ message, code, data }: CreateHttpResponseDtoProps<TDataDto>) {
        const responseMessage: string = message ?? CoreCodeDescriptions.INTERNAL_ERROR.message;
        const responseCode: number = code ?? CoreCodeDescriptions.INTERNAL_ERROR.code;

        return new HttpResponseDto({ message: responseMessage, code: responseCode, data });
    }
}
