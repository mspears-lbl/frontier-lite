import { Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import { getUserFromRequest } from '../lib/get-user-from-request';
import { JwtManager } from '../lib/jwt-manager';
import * as util from 'util';
import { AccountConfirmor, accountNeedsConfirmation, getConfirmationCode, sendConfirmationEmail } from '../models/account-confirmor';

const logger = createLogger(module);

export class LoginGoogleHandler {
    constructor(
        private request: Request,
        private response: Response
    ) {
    }

    public static async handleRequest(
        request: Request,
        response: Response
    ): Promise<any> {
        const handler = new LoginGoogleHandler(request, response);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug('authentication success');
            console.log(this.request.user);
            // setup the JWT token
            const user = getUserFromRequest(this.request);
            const tokenResponse = JwtManager.buildNewTokenResponse(user);

            // if (!process.env.SKIP_MFA) {
            //     // set the user status to requiring a verification code 
            //     user.setStatus(UserLoginStatus.NeedsVerify)
            // }
            // resolve(
            //     buildNewTokenResponse(token, user)
            // );
            // if (accountNeedsConfirmation(user)) {
            //     const code = await getConfirmationCode(user);
            //     sendConfirmationEmail(user, code);
            // }
            logger.debug(`token Response:`);
            logger.debug(util.inspect(tokenResponse, {depth: null}));
            // this.response.json(tokenResponse);
            const url = `/auth/google/success?token=${tokenResponse.token}&expiresIn=${tokenResponse.expiresIn}`;
            this.response.redirect(url);
        } catch (error) {
            logger.error('Error in LoginGoogleHandler');
            logger.debug(util.inspect(error))
            this.response.status(500).send();
        }
    }

}
