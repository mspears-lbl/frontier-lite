import { Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { UserPasswordResetFinal } from '../models/user-password-reset';
import { HttpStatusCode } from '../../../../common/models/http-status-codes';
import { isPasswordResetFinalRequest, isPasswordResetRequest, PasswordResetFinalRequest, PasswordResetRequest } from '../../../../common/models/password-reset';

const logger = createLogger(module);

export class PasswordResetHandler {
    constructor(
        private request: Request,
        private response: Response
    ) {
    }

    public static async handleRequest(
        request: Request,
        response: Response
    ): Promise<any> {
        const handler = new PasswordResetHandler(request, response);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            const params = this.getParams();
            console.log(this.request.url);
            await UserPasswordResetFinal.run(params);
            this.response.status(HttpStatusCode.OK).send();
        } catch (error) {
            logger.error('Error in PasswordResetHandler');
            logger.debug(util.inspect(error))
            // throw error;
            this.response.status(500).send();
        }
    }

    private getParams(): PasswordResetFinalRequest {
        const params = this.request.body;
        if (!isPasswordResetFinalRequest(params)) {
            throw new Error('Invalid parameters');
        }
        return params;
    }

}
