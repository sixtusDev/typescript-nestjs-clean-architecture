import { RepositoryPort } from '@shared/core/ports/RepositoryPort';
import { Role, RoleNames } from '../../entities/Role';

export interface RoleRepositoryPort
    extends Pick<RepositoryPort<Role, { id?: string; name?: RoleNames }>, 'findOne' | 'exists'> {}
