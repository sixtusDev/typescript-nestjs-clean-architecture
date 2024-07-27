import { User } from '@identity-and-access/core/domain/entities/User';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpAuthService } from '../HttpAuthService';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { ConfigPort } from '@shared/core/ports/ConfigPort';
import { ConfigKeys } from '@shared/core/constants/ConfigKeys';
import { CoreDITokens } from '@shared/core/constants/CoreDITokens';
import { HttpUserProps } from '@shared/presentation/http/types/HttpUserTypes';

interface HttpJwtProps {
    id: string;
}

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: HttpAuthService,
        @Inject(CoreDITokens.CONFIG)
        private readonly config: ConfigPort,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader(config.getString(ConfigKeys.JWT_ACCESS_TOKEN_HEADER)),
            ignoreExpiration: false,
            secretOrKey: config.getString(ConfigKeys.JWT_ACCESS_TOKEN_SECRET),
        });
    }

    public async validate(props: HttpJwtProps): Promise<HttpUserProps> {
        const user: User = AssertUtil.notEmpty(
            await this.authService.getUser({ id: props.id }),
            CoreError.create({ codeDescription: CoreCodeDescriptions.UNAUTHORIZED_ERROR }),
        );

        return {
            id: user.getId.getValue,
            email: user.getEmail,
            username: user.getUsername,
            firstName: user.getFirstName,
            lastName: user.getLastName,
        };
    }
}
