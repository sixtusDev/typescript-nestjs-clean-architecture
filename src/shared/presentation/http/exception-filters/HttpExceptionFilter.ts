import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { CoreError } from '@shared/core/errors/CoreError';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { HttpResponseDto } from '../dtos/HttpResponseDto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly logger: LoggerPort,
        private readonly config: ConfigPort,
    ) {}

    public catch(error: Error, host: ArgumentsHost): void {
        const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse<Response>();

        let errorResponse: HttpResponseDto<unknown> = HttpResponseDto.error({
            code: CoreCodeDescriptions.INTERNAL_ERROR.code,
            message: error.message,
        });

        errorResponse = this.handleNestError(error, errorResponse);
        errorResponse = this.handleCoreException(error, errorResponse);

        if (this.config.getBool(ConfigKeys.ENABLE_LOG)) {
            const message: string =
                `Method: ${request.method}; ` + `Path: ${request.path}; ` + `Error: ${errorResponse.message}`;

            this.logger.error(message, HttpExceptionFilter.name);
        }

        response.json(errorResponse);
    }

    private handleNestError(error: Error, errorResponse: HttpResponseDto<unknown>): HttpResponseDto<unknown> {
        if (error instanceof HttpException) {
            errorResponse = HttpResponseDto.error({ code: error.getStatus(), message: error.message, data: null });
        }

        if (error instanceof UnauthorizedException) {
            errorResponse = HttpResponseDto.error({
                code: CoreCodeDescriptions.UNAUTHORIZED_ERROR.code,
                message: CoreCodeDescriptions.UNAUTHORIZED_ERROR.message,
                data: null,
            });
        }

        return errorResponse;
    }

    private handleCoreException(error: Error, errorResponse: HttpResponseDto<unknown>): HttpResponseDto<unknown> {
        if (error instanceof CoreError) {
            errorResponse = HttpResponseDto.error({ code: error.code, message: error.message, data: error.data });
        }

        return errorResponse;
    }
}
