import * as express from 'express';
import passport from 'passport';
import { localStrategy } from './strategies/local-strategy';
import { jwtStrategy } from './strategies/jwt-strategy';
import { googleStrategy } from './strategies/google-strategy';
import { apiKeyStrategy } from './strategies/api-key-strategy';

/**
 * Configures the passport library.
 */
export function authenticationConfig(express: express.Application): void {
    // create the authentication strategies
    passport.use(localStrategy);
    passport.use(jwtStrategy);
    passport.use(googleStrategy);
    // passport.use(apiKeyStrategy);
    // register passport with express
    express.use(passport.initialize());
    // express.use(passport.session());
}
