import { LoggerPort } from '@shared/core/ports/LoggerPort';
import * as winston from 'winston';

import { LoggerService } from '@nestjs/common';

export class WinstonLoggerAdapter implements LoggerPort, LoggerService {
    constructor(private readonly logger: winston.Logger) {}

    log(message: string, context: string, ...meta: any[]): void {
        this.logger.info(message, { context, ...meta });
    }

    debug(message: string, context: string, ...meta: any[]): void {
        this.logger.debug(message, { context, ...meta });
    }

    warn(message: string, context: string, ...meta: any[]): void {
        this.logger.warn(message, { context, ...meta });
    }

    error(message: string, context: string, ...meta: any[]): void {
        this.logger.error(message, { context, ...meta });
    }
}
