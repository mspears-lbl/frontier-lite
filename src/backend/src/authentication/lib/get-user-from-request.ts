import { Request } from "express";
import { createLogger } from '../../logging/index';
import { AppUserAuth } from '../models/app-user-auth';

const logger = createLogger(module);

/**
 * Extract the CurrentUser, the user who is currently authenticated,
 * from the express.Request object.
 * @param request 
 * @returns The authenticated CurrentUser
 */
export function getUserFromRequest(request: Request): AppUserAuth {
    const currentUser = <AppUserAuth>request.user;
    // make user is valid
    if (!currentUser) {
        logger.error('User serialization error in verifyCodeHandler, unable to cast user to WelderUser');
        throw new Error('Unable to retrieve user from request');
    }
    return currentUser;
}
