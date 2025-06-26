import * as passportJwt from 'passport-jwt';

export const JwtStrategyOptions: passportJwt.StrategyOptionsWithoutRequest = {
    jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: String(process.env.JWT_SECRET)
}
