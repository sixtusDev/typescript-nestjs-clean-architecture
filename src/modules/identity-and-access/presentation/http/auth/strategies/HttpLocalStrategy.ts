import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpAuthService } from '../HttpAuthService';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { Strategy } from 'passport-local';
import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { HttpUserProps } from '@shared/presentation/http/types/HttpUserTypes';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: HttpAuthService,
        @Inject(CoreDITokens.CONFIG)
        private readonly config: ConfigPort,
    ) {
        super({
            usernameField: config.getString(ConfigKeys.JWT_LOGIN_USERNAME_FIELD),
            passwordField: config.getString(ConfigKeys.JWT_LOGIN_PASSWORD_FIELD),
        });
    }

    public async validate(uid: string, password: string): Promise<HttpUserProps> {
        const user: HttpUserProps = AssertUtil.notEmpty(
            await this.authService.validateUser(uid, password),
            CoreError.create({ codeDescription: CoreCodeDescriptions.WRONG_CREDENTIALS_ERROR }),
        );

        return user;
    }
}
