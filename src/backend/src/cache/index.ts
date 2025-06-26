import { SetOptions, createClient } from 'redis';

const cachePort = process.env.CACHE_PORT ? +process.env.CACHE_PORT : undefined;
const cacheHost = process.env.CACHE_HOST;
const cachePassword = process.env.CACHE_PASSWORD;
if (!cachePort) {
	throw new Error('CACHE_PORT not set');
}
else if (!cacheHost) {
	throw new Error('CACHE_HOST not set');
}
else if (!cachePassword) {
	throw new Error('CACHE_PASSWORD not set');
}
export const redisClient = createClient({socket: {host: cacheHost, port: cachePort}, password: cachePassword});

/** The number of seconds until cache items expire (2 hours) */
export const cacheOptions: SetOptions = {EX: 2 * 60 * 60};

redisClient.on('error', err => console.log('Redis Client Error', err));

console.log('connect to redis...');
const promise = redisClient.connect();

Promise.all([promise])
.then(results => {
	console.log('successfully connected to redis')
}, (error) => {
	console.log('error connecting to redis');
	console.log(error);
});
