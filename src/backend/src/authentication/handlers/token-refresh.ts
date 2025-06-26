import { Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import { JwtManager } from '../lib/jwt-manager';
import * as util from 'util';
import { HttpStatusCode } from '../../../../common/models/http-status-codes';

const logger = createLogger(module);

/** Handler for refreshing an expired token */
export function tokenRefresher(request: Request, response: Response, next: Function) {
    try {
        const authorization = request.get('authorization');
        const token = authorization ? authorization.replace('Bearer ', '') : undefined;
        if (!token) {
            throw new Error('Invalid Paramters');
        }
        if (JwtManager.canRenewToken(token)) {
            console.log('yes can renew the token')
            const newToken = JwtManager.renewToken(token)
            response.json(JwtManager.buildRenewTokenResponse(newToken))
        }
        else {
            console.log('no cannot renew token')
            response.status(HttpStatusCode.UNAUTHORIZED).send();
        }
    }
    catch (error) {
        logger.error('Error in tokenRefresher');
        logger.error(util.inspect(error, {depth: null}));
        throw new Error('Unable to renew Token');
    }
}

