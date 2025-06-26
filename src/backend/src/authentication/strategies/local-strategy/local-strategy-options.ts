import * as passportLocal from 'passport-local';

export const localStrategyOptions: passportLocal.IStrategyOptions = {
    usernameField: 'email',
    session: false
}
