import { UseCase } from '@shared/core/usecases/UseCase';
import { CreateUserRoleRequestDto, CreateUserRoleResponseDto } from './dtos/CreateUserRoleDto';
import { UserRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRepositoryPort';
import { UserRoleRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/UserRoleRepositoryPort';
import { AssertUtil } from '@shared/core/utils/AssertUtil';
import { CoreError } from '@shared/core/errors/CoreError';
import { CoreCodeDescriptions } from '@shared/core/constants/CoreCodeDescriptions';
import { UserRole } from '@identity-and-access/core/domain/entities/UserRole';
import { UniqueId } from '@shared/core/value-objects/UniqueId';
import { Role } from '@identity-and-access/core/domain/entities/Role';
import { RoleRepositoryPort } from '@identity-and-access/core/domain/ports/repositories/RoleRepositoryPort';

export class CreateUserRoleUseCase implements UseCase<CreateUserRoleRequestDto, CreateUserRoleResponseDto> {
    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly userRoleRepository: UserRoleRepositoryPort,
        private readonly roleRepository: RoleRepositoryPort,
    ) {}
    public async execute(
        request?: CreateUserRoleRequestDto,
        transactionRef?: unknown,
    ): Promise<CreateUserRoleResponseDto> {
        const userId: UniqueId = UniqueId.create(request.userId);

        const doesUserExist: boolean = await this.userRepository.exists({ id: userId.getValue });
        AssertUtil.isFalse(
            doesUserExist,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_ALREADY_EXISTS_ERROR,
                overrideMessage: 'User already exist!',
            }),
        );

        const role: Role = await this.roleRepository.findOne({ name: request.roleName });
        AssertUtil.isTrue(
            !!role,
            CoreError.create({
                codeDescription: CoreCodeDescriptions.ENTITY_NOT_FOUND_ERROR,
                overrideMessage: 'Role does not exist!',
            }),
        );

        const userRole: UserRole = UserRole.create({ roleId: role.getId, userId: userId });

        await this.userRoleRepository.createOne(userRole, transactionRef);
    }
}
