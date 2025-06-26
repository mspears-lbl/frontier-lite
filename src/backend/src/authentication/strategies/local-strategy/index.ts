import * as passportLocal from 'passport-local';
import { localStrategyOptions } from './local-strategy-options';
import { LocalStrategyVerifier } from './local-strategy-verifier';

export const localStrategy = new passportLocal.Strategy(
    localStrategyOptions,
    LocalStrategyVerifier.buildAndRun
)
