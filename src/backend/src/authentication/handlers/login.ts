import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
// import { WelderError } from '../../../../welder-common/welder-error/index';
// import { WUnknownAuthError } from '@welder-common/welder-error/welder-auth-error/unknown-auth-error';
import { getUserFromRequest } from '../lib/get-user-from-request';
import { JwtManager } from '../lib/jwt-manager';
import * as util from 'util';

const logger = createLogger(module);

export class LoginHandler {
    constructor(
        private request: Request,
        private response: Response,
        private next: NextFunction
    ) {
    }

    public static async handleRequest(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<any> {
        const handler = new LoginHandler(request, response, next);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug('authentication success');
            // setup the JWT token
            const user = getUserFromRequest(this.request)
            const tokenResponse = JwtManager.buildNewTokenResponse(user);

            // if (!process.env.SKIP_MFA) {
            //     // set the user status to requiring a verification code 
            //     user.setStatus(UserLoginStatus.NeedsVerify)
            // }
            // resolve(
            //     buildNewTokenResponse(token, user)
            // );
            logger.debug(`token Response:`);
            logger.debug(util.inspect(tokenResponse, {depth: null}));
            this.response.json(tokenResponse);
        } catch (error) {
            logger.error('Error in LoginHandler');
            this.next(error);
        }
    }

}
