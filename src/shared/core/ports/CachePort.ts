import { Nullable } from '../types/UtilityTypes';

export interface CachePort {
    get<T>(key: string): Promise<Nullable<T>>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
}
