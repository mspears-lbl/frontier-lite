import { Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import { getUserFromRequest } from '../lib/get-user-from-request';
import { JwtManager } from '../lib/jwt-manager';
import * as util from 'util';
import { AccountConfirmor, accountNeedsConfirmation, getConfirmationCode, sendConfirmationEmail } from '../models/account-confirmor';

const logger = createLogger(module);

export class LoginGoogleFailHandler {
    constructor(
        private request: Request,
        private response: Response
    ) {
    }

    public static async handleRequest(
        request: Request,
        response: Response
    ): Promise<any> {
        const handler = new LoginGoogleFailHandler(request, response);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug('authentication failed');
            this.response.redirect('/auth/google/failure');
        } catch (error) {
            logger.error('Error in LoginGoogleFailHandler');
            logger.debug(util.inspect(error))
            this.response.redirect('/auth/google/failure');
        }
    }

}
