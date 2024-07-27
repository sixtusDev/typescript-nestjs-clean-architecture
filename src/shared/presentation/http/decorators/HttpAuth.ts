import { applyDecorators, UseGuards } from '@nestjs/common';
import { HttpJwtAuthGuard } from '../guards/HttpJwtAuthGuard';

export const HttpAuth = (): ((...args: unknown[]) => void) => {
    return applyDecorators(UseGuards(HttpJwtAuthGuard));
};
