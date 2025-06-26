import { Router } from 'express';
import passport from 'passport';
import * as handlers from './handlers';

// Router for the authentication endpoints
export const router = Router();

/** Create a user */
router.post(
    '/user-request',
    passport.authenticate('jwt', { session: false }),
    handlers.CreateUserHandler.handleRequest
);
