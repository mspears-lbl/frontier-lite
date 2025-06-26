import { Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import { getUserFromRequest } from '../lib/get-user-from-request';
import { toAppUser } from '../models/app-user-auth';
import { HttpStatusCode } from '../../../../common/models/http-status-codes';

const logger = createLogger(module);

/** Handler for retrieving the user information for an authenticated user. */
export function getAuthUserHandler(request: Request, response: Response) {
    try {
        const user = getUserFromRequest(request);
        console.log('user');
        console.log(user);
        response.json(toAppUser(user));
    }
    catch(error) {
        response.status(HttpStatusCode.BAD_REQUEST).send();
    }
};
