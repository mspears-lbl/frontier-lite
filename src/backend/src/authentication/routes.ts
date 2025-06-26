import { Router, Request, Response } from 'express';
import passport from 'passport';

import * as handlers from './handlers';
// import { mfaMiddleware } from './mfa.middleware';
// import { adminLoginHandler } from './handlers/admin-login';
// import { epbAdminMiddleware } from './epb-admin.middleware';

// Router for the authentication endpoints
export const router = Router();

router.get(
    '/login/google',
    // rateLimiterUI,
    passport.authenticate('google', { session: false, scope : ['profile', 'email'] }),
    handlers.LoginGoogleHandler.handleRequest
);
router.get(
    '/auth/google/callback',
    // rateLimiterUI,
    passport.authenticate('google', { session: false, failureRedirect: '/api/auth/google/failure', failureMessage: true, failWithError: true }),
    handlers.LoginGoogleHandler.handleRequest
    // (request, response) => {
    //     console.log('google success... redirect');
    //     //@ts-ignore
    //     const token = request.user;
    //     console.log(token);
    //     response.redirect('/auth/google/success');
    // }
);
router.get(
    '/auth/google/failure',
    // rateLimiterUI,
    handlers.LoginGoogleFailHandler.handleRequest
);
/** User Login */
router.post(
    '/login',
    passport.authenticate('local', { session: false }),
    handlers.LoginHandler.handleRequest
);
router.post(
    '/logout',
    passport.authenticate('jwt', { session: false }),
    handlers.logoutHandler
);
router.get(
    '/user',
    passport.authenticate('jwt', {session: false}),
    handlers.getAuthUserHandler
);
// /** Handle requests for create user accounts. */
// router.put(
//     '/user',
//     passport.authenticate('jwt', {session: false}),
//     handlers.UpdateUserAccountHandler.handleRequest
// );
// router.get(
//     '/user-list',
//     passport.authenticate('jwt', {session: false}),
//     handlers.GetUserListHandler.handleRequest
// );
// /** Refreshes an expired JWT */
// router.get(
//     '/token/refresh',
//     passport.authenticate('jwt', {session: false}),
//     handlers.tokenRefresher
// );
// /** Handle requests for creating account registration records */
// router.post(
//     '/register',
//     handlers.CreateRegistrationInfoHandler.handleRequest
// );
// /** Handle requests for updating account registration status. */
// router.put(
//     '/registration/:id',
//     passport.authenticate('jwt', {session: false}),
//     handlers.UpdateRegistrationStatusHandler.handleRequest
// );
// /** Handle requests for retrieving user registration records */
// router.get(
//     '/registration',
//     passport.authenticate('jwt', {session: false}),
//     handlers.GetRegistrationInfoHandler.handleRequest
// );
// /** Handle requests for create user accounts. */
// router.post(
//     '/user',
//     passport.authenticate('jwt', {session: false}),
//     handlers.CreateUserAccountInfoHandler.handleRequest
// );
// router.post(
//     '/password-reset/request',
//     handlers.PasswordResetRequestHandler.handleRequest
// );

// router.post(
//     '/password-reset',
//     handlers.PasswordResetHandler.handleRequest
// );
