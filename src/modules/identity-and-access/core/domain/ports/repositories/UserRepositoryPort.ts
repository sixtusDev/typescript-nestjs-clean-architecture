import { User } from '../../entities/User';
import { RepositoryPort } from '@shared/core/ports/RepositoryPort';

export interface UserRepositoryPort extends RepositoryPort<User, { id?: string; email?: string; username?: string }> {}
