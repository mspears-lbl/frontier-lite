import * as passportJwt from 'passport-jwt';
import { JwtStrategyOptions } from './jwt-strategy-options';
import { JwtStrategyVerifier } from './jwt-strategy-verifier';

export const jwtStrategy = new passportJwt.Strategy(
    JwtStrategyOptions,
    JwtStrategyVerifier.buildAndRun
);
