import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerPort } from '@shared/core/ports/LoggerPort';
import { HttpResponseDto } from '../dtos/HttpResponseDto';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerPort) {}

    public intercept(context: ExecutionContext, next: CallHandler): Observable<HttpResponseDto<void>> {
        const request: Request = context.switchToHttp().getRequest();
        const requestStartDate: number = Date.now();

        return next.handle().pipe(
            tap((): void => {
                const requestFinishDate: number = Date.now();

                const message: string =
                    `Method: ${request.method}; ` +
                    `Path: ${request.path}; ` +
                    `SpentTime: ${requestFinishDate - requestStartDate}ms`;

                this.logger.log(message, HttpLoggingInterceptor.name);
            }),
        );
    }
}
