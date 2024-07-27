import { RepositoryPort } from '@shared/core/ports/RepositoryPort';
import { UserRole } from '../../entities/UserRole';

export interface UserRoleRepositoryPort extends RepositoryPort<UserRole, { id?: string; userId?: string }> {}
