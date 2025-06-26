import * as passportApiKey from 'passport-headerapikey';
import { apiKeyStrategyOptions } from './api-key-strategy-options';
import { ApiKeyStrategyVerifier } from './api-key-strategy-verifier';

export const apiKeyStrategy = new passportApiKey.HeaderAPIKeyStrategy(
    apiKeyStrategyOptions,
    true,
    ApiKeyStrategyVerifier.buildAndRun
)
