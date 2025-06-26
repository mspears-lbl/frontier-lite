import * as jwt from 'jsonwebtoken';
import { JwtPayload, isJwtPayload } from '../models/jwt-payload';
import { AppUserAuth } from '../models/app-user-auth';
import { TokenResponse } from '../../../../common/models/auth';

export class JwtManager {
    
    constructor() {
    }

    /** Time in seconds the JWT token is set to expire */
    // private static readonly TOKEN_EXPIRE_TIME = 60 * 60 * 12;
    private static readonly TOKEN_EXPIRE_TIME = 60 * 60 * 12;
    /** Time in seconds the JWT token is available for renewal */
    private static readonly TOKEN_RENEW_INTERVAL = 60 * 1;

    private static getExpireTime(): number {
        return Math.floor(Date.now() / 1000) + JwtManager.TOKEN_EXPIRE_TIME;
    }

    public static canRenewToken(token: string): boolean {
        const parsed = jwt.decode(token);
        if (!isJwtPayload(parsed)) {
            console.log('invalid parsed token')
            throw new Error('Invalid token');
        }
        const currentTime = (new Date()).getTime();
        return (parsed.exp * 1000) - currentTime < JwtManager.TOKEN_RENEW_INTERVAL * 1000
            ? true : false;
    }

    public static renewToken(token: string): string {
        if (!JwtManager.canRenewToken(token)) {
            throw new Error('Cannot renew expired token');
        }
        const parsed = <JwtPayload>jwt.decode(token);
        return JwtManager.createToken(parsed.uuid)
    }

    public static buildNewTokenResponse(user: AppUserAuth): TokenResponse {
        const token = JwtManager.createToken(user.uuid);
        return {
            token,
            expiresIn: JwtManager.TOKEN_EXPIRE_TIME * 1000
        };
    }

    public static buildRenewTokenResponse(token: string): TokenResponse {
        return {
            token,
            expiresIn: JwtManager.TOKEN_EXPIRE_TIME * 1000
        };
    }

    public static createToken(uuid: string): string {
        const payload: JwtPayload = {
            uuid,
            exp: JwtManager.getExpireTime()
        };
        return jwt.sign(
            payload,
            String(process.env.JWT_SECRET)
        )

    }

}
