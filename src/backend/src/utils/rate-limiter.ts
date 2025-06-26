import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from '../cache';


export const rateLimiterUI = rateLimit({
    // Rate limiter configuration
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (request, response) => request.get('x-real-ip') || request.ip || '',

    // Redis store configuration
    store: new RedisStore({
        sendCommand: (...args: string[]) => {
            return redisClient.sendCommand(args)
        },
    }),
});

export const rateLimiterAPI = rateLimit({
    // Rate limiter configuration
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (request, response) => request.get('x-real-ip') || request.ip || '',

    // Redis store configuration
    store: new RedisStore({
        sendCommand: (...args: string[]) => {
            return redisClient.sendCommand(args)
        },
    }),
});
