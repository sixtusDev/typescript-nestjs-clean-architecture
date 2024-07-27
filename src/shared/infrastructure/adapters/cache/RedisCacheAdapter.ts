import { CachePort } from '@shared/core/ports/CachePort';
import { Redis } from 'ioredis';

export class RedisCacheAdapter implements CachePort {
    constructor(private readonly client: Redis) {}

    async get<T>(key: string): Promise<T | null> {
        const value: string = await this.client.get(key);

        return value ? JSON.parse(value) : null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const serializedValue: string = JSON.stringify(value);

        if (ttl) {
            await this.client.setex(key, ttl, serializedValue);
        } else {
            await this.client.set(key, serializedValue);
        }
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}
