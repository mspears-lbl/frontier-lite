import { createLogger } from '../../../logging/index';
import { getUserByEmailQuery } from '../../queries/user/get/by-email/index';
import { comparePassword } from '../../lib/compare-password';
import { NextFunc } from '../../types/next-function';
import * as util from 'util';
import { AppUserAuth } from '../../models/app-user-auth';
import { AppAuthenticationError } from '../../../../../common/models/errors';
import { UserStatus } from '../../../../../common/models/app-user';
// import { UserV1Transfer } from '../../models/user-v1-transfer';

const logger = createLogger(module);

export class LocalStrategyVerifier {

    constructor(
        private email: string,
        private password: string,
        private next: NextFunc
    ) {
    }

    public static async buildAndRun(
        email: string,
        password: string,
        next: NextFunc
    ): Promise<any> {
        const verifier = new LocalStrategyVerifier(email, password, next);
        return verifier.run();
    }

    public async run(): Promise<any> {
        try {
            const user = await this.loadOrTransferUserRecord();
            this.checkUserStatus(user);
            await this.comparePassword(user);
            this.done(user);
        } catch (error: any) {
            this.next(error, undefined);
        }
    }

    private async loadOrTransferUserRecord(): Promise<AppUserAuth> {
        // try {
            return await this.loadUserRecord();
        // } catch (error: any) {
        //     return await this.transferUserRecord();
        // }
    }

    private async loadUserRecord(): Promise<AppUserAuth> {
        try {
            logger.debug(`load the user record for ${this.email}`);
            const userData = await getUserByEmailQuery.run(this.email);
            return userData;
        } catch (error) {
            logger.error('Error in loadUserRecord');
            logger.debug(util.inspect(error, {depth: null}));
            throw new AppAuthenticationError('User not found');
        }
    }

    // private async transferUserRecord(): Promise<AppUserAuth> {
    //     try {
    //         logger.debug(`transfer the user record for ${this.email}`);
    //         const hasV1Record = await UserV1Transfer.hasV1Account(this.email);
    //         if (!hasV1Record) {
    //             throw new AppAuthenticationError('User does not have a V1 record');
    //         }
    //         return await UserV1Transfer.run(this.email, this.password);
    //     } catch (error) {
    //         logger.error('Error in transferUserRecord');
    //         throw error;
    //     } 

    // }

    private checkUserStatus(user: AppUserAuth): void {
        try {
            logger.debug(`Make sure the account isn't disabled for ${this.email}`);
            logger.debug(util.inspect(user, {depth: null}));
            if (user.status === UserStatus.Disabled) {
                throw new AppAuthenticationError('Account is disabled');
            }
        } catch (error) {
            logger.error('Error in checkUserStatus');
            throw error;
        }
    }

    private async comparePassword(user: AppUserAuth): Promise<void> {
        try {
            const passwordMatch = await comparePassword(this.password, user.passwordHash)
            if (!passwordMatch) {
                throw new AppAuthenticationError('Password mismatch');
            }
        } catch (error) {
            throw error;
        }
    }

    private done(user: AppUserAuth): void {
        return this.next(null, user);
    }
}
