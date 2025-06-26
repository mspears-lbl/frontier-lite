import * as passportGoogle from 'passport-google-oauth2';
import { appHost } from '../../../utils/app-host';

export const googleStrategyOptions: passportGoogle.StrategyOptionsWithRequest = {
	clientID:     process.env.GOOGLE_CLIENT_ID!,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
	callbackURL: `${appHost}/api/auth/google/callback`,
	passReqToCallback   : true
}
