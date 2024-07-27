import { RepositoryPort } from '@shared/core/ports/RepositoryPort';
import { UserProfile } from '../../entities/UserProfile';

export interface UserProfileRepositoryPort extends RepositoryPort<UserProfile, { id?: string; userId?: string }> {}
