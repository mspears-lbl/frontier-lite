import { SetOptions } from "redis";
import { cacheOptions, redisClient } from "../../cache";
import { createLogger } from "../../logging";

const logger = createLogger(module);

export abstract class CacheManager {
	protected abstract keyPrefix: string;
	protected cacheOptions: SetOptions | undefined;

	protected generateCacheKey(key: string): string {
		return `${this.keyPrefix}:${key}`;
	}

	public async setCacheCode(key: string, code: string): Promise<void> {
		try {
			const cacheKey = this.generateCacheKey(key);
			console.log(`set cache ${cacheKey} to ${code}`)
			await redisClient.set(cacheKey, code, this.cacheOptions);
		} catch (error: any) {
			console.log(`Error setting the cache code for ${key}`);
			throw error;
		}
	}

	public async hasMatchingCode(key: string, code: string): Promise<boolean> {
		try {
			const cacheKey = this.generateCacheKey(key);
			const storedCode = await redisClient.get(cacheKey);
			console.log(`stored code ${storedCode} for ${key}`);
			return storedCode === code ? true : false;
		} catch (error: any) {
			console.log(`Error checking the cache code for ${key}`);
			throw error;
		}
	}

	public async deleteCacheCode(key: string): Promise<void> {
		try {
			const cacheKey = this.generateCacheKey(key);
			await redisClient.del(cacheKey);
		} catch (error: any) {
			console.log(`Error deleting the cached info for ${key}`);
			throw error;
		}
	}
}

export abstract class CachePayloadManager<T> extends CacheManager {
	/** The type guard function for the payload. */
	protected abstract verifier: (value: any) => value is T;


	public async setPayload(key: string, payload: T): Promise<void> {
		try {
			const payloadString = JSON.stringify(payload);
			const cacheKey = this.generateCacheKey(key);
			await redisClient.set(cacheKey, payloadString, this.cacheOptions);
		} catch (error: any) {
			console.log(`Error setting the cache payload for ${key}`);
			throw error;
		}
	}

	public async extractPayload(key: string): Promise<T> {
		try {
			const cacheKey = this.generateCacheKey(key);
			const payloadString= await redisClient.get(cacheKey);
			logger.debug(`payload for ${cacheKey} = "${payloadString}"`)
			const payload = JSON.parse(payloadString!);
			if (!this.verifier(payload)) {
				throw new Error('Invalid payload');
			}
			return payload;
		} catch (error: any) {
			console.log(`Error retrieving cache payload for ${key}`);
			throw error;
		}
	}

}