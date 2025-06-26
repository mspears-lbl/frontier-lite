import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { UserPasswordResetInitial } from '../models/user-password-reset';
import { HttpStatusCode } from '../../../../common/models/http-status-codes';
import { PasswordResetEmailError } from '../../../../common/models/errors/password-reset-email-error';
import { isPasswordResetRequest, PasswordResetRequest } from '../../../../common/models/password-reset';
import { AppServerError } from '../../../../common/models/errors';

const logger = createLogger(module);

export class PasswordResetRequestHandler {
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
        const handler = new PasswordResetRequestHandler(request, response, next);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            const params = this.getParams();
            console.log(this.request.url);
            const result = await UserPasswordResetInitial.run(params.email);
            if (result.userExists && result.emailSent) {
                this.response.status(HttpStatusCode.OK).send();
            }
            else if (!result.userExists) {
                throw new PasswordResetEmailError();
            }
            else {
                throw new AppServerError('Unable to send password reset email');
            }
        } catch (error) {
            logger.error('Error in PasswordResetRequestHandler');
            this.next(error)
        }
    }

    private getParams(): PasswordResetRequest {
        const params = this.request.body;
        if (!isPasswordResetRequest(params)) {
            throw new Error('Invalid parameters');
        }
        return params;
    }

}
