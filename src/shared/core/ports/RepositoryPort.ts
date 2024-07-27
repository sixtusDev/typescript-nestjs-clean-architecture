import { RepositoryFindOptions } from '../persistence/RepositoryOptions';
import { Nullable } from '../types/UtilityTypes';

export interface RepositoryPort<TEntity, TFindBy> {
    findOne(by: TFindBy, options?: RepositoryFindOptions): Promise<Nullable<TEntity>>;
    createOne(entity: TEntity, transactionRef?: unknown): Promise<void>;
    updateOne(entity: TEntity, transactionRef?: unknown): Promise<void>;
    exists(by: TFindBy, options?: RepositoryFindOptions): Promise<boolean>;
}
