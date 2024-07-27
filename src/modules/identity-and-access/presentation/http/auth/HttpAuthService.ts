import { Nullable } from '@shared/core/types/UtilityTypes';
import { UserDITokens } from '@identity-and-access/core/domain/constants/UserDITokens';
import { User } from '@identity-and-access/core/domain/entities/User';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPassword } from '@identity-and-access/core/domain/value-objects/UserPassword';
import { StringUtil } from '@shared/core/utils/StringUtil';
import { HttpUserProps } from '@shared/presentation/http/types/HttpUserTypes';

export interface HttpLoggedInUser {
    id: string;
    accessToken: string;
}

@Injectable()
export class HttpAuthService {
    constructor(
        @Inject(UserDITokens.USER_REPOSITORY)
        private readonly userRepository: UserRepositoryPort,
        private readonly jwtService: JwtService,
    ) {}

    public async validateUser(uid: string, passport: string): Promise<Nullable<HttpUserProps>> {
        const isValidEmail = StringUtil.isValidEmail(uid);

        const user: Nullable<User> = await this.userRepository.findOne({
            ...(isValidEmail && { email: uid }),
            ...(!isValidEmail && { username: uid }),
        });
        if (!user) return null;

        const password: UserPassword = UserPassword.create(user.getPassword.getValue, true);
        const isPasswordValid: boolean = await password.comparePasswords(passport);
        if (!isPasswordValid) return null;

        return {
            id: user.getId.getValue,
            email: user.getEmail,
            username: user.getUsername,
            firstName: user.getFirstName,
            lastName: user.getLastName,
        };
    }

    public login(props: HttpUserProps): HttpLoggedInUser {
        return {
            id: props.id,
            accessToken: this.jwtService.sign(props),
        };
    }

    public async getUser(by: { id: string }): Promise<Nullable<User>> {
        return await this.userRepository.findOne(by);
    }
}
