import { createLogger } from '../../logging/index';

const logger = createLogger(module);

export class QueryCache {
    private cache = new Map<string, { data: any; expires: number }>();
    private defaultTTL = 300000; // 5 minutes in ms

    async get<T>(key: string): Promise<T | null> {
        const cached = this.cache.get(key);
        if (!cached || Date.now() > cached.expires) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    }

    async set(key: string, value: any, ttl = this.defaultTTL): Promise<void> {
        this.cache.set(key, {
            data: value,
            expires: Date.now() + ttl
        });
    }

    generateKey(prefix: string, params: any): string {
        return `${prefix}:${JSON.stringify(params)}`;
    }
}

export const queryCache = new QueryCache();
