export interface RepositoryFindOptions {
    includeDeleted?: boolean;
    limit?: number;
    offset?: number;
}

export interface RepositoryUpdateManyOptions {
    includeDeleted?: boolean;
}

export interface RepositoryDeleteOptions {
    withSoftDelete?: boolean;
}
