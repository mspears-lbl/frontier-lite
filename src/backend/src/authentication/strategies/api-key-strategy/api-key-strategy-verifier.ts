import { createLogger } from '../../../logging/index';
import { NextFunc } from '../../types/next-function';
import * as util from 'util';
import { AppUserAuth } from '../../models/app-user-auth';
import { AppAuthenticationError } from '../../../../../common/models/errors';
import { UserStatus } from '../../../../../common/models/app-user';
import { getUserByApiKeyQuery } from '../../queries/user/get/by-api-key';

const logger = createLogger(module);

export class ApiKeyStrategyVerifier {

    constructor(
        private apiKey: string,
        private next: NextFunc
    ) {
    }

    public static async buildAndRun(
        apiKey: string,
        next: NextFunc
    ): Promise<any> {
        const verifier = new ApiKeyStrategyVerifier(apiKey, next);
        return verifier.run();
    }

    public async run(): Promise<any> {
        try {
            const user = await this.loadUserRecord();
            this.checkUserStatus(user);
            this.done(user);
        } catch (error: any) {
            this.next(error, undefined);
        }
    }

    private async loadUserRecord(): Promise<AppUserAuth> {
        try {
            logger.debug(`load the user record for ${this.apiKey}`);
            const userData = await getUserByApiKeyQuery.run({apiKey: this.apiKey});
            return userData;
        } catch (error) {
            logger.error('Error in loadUserRecord');
            logger.debug(util.inspect(error, {depth: null}));
            throw new AppAuthenticationError('User not found');
        }
    }

    private checkUserStatus(user: AppUserAuth): void {
        try {
            logger.debug(`Make sure the account isn't disabled for ${this.apiKey}`);
            logger.debug(util.inspect(user, {depth: null}));
            if (user.status === UserStatus.Disabled) {
                throw new AppAuthenticationError('Account is disabled');
            }
        } catch (error) {
            logger.error('Error in checkUserStatus');
            throw error;
        }
    }

    private done(user: AppUserAuth): void {
        return this.next(null, user);
    }
}
