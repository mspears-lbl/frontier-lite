import * as passportGoogle from 'passport-google-oauth2';
import { googleStrategyOptions } from './google-strategy-options';
import { GoogleStrategyVerifier } from './google-strategy-verifier';

export const googleStrategy = new passportGoogle.Strategy(
	googleStrategyOptions,
	GoogleStrategyVerifier.buildAndRun
);
