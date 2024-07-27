import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HttpRequestWithUser, HttpUserProps } from '../types/HttpUserTypes';

export const HttpUser: () => any = createParamDecorator((data: unknown, ctx: ExecutionContext): HttpUserProps => {
    const request: HttpRequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
});
