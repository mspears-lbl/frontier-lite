import { createLogger } from '../../../logging/index';
import { AppUserAuth } from '../../models/app-user-auth';
import * as util from 'util';
import * as passportGoogle from 'passport-google-oauth2';
import { getUserByEmailQuery } from '../../queries/user/get/by-email';
import { Request } from 'express';
import { UserRole, UserStatus } from '../../../../../common/models/app-user';
import { AppAuthenticationError } from '../../../../../common/models/errors';
// import { UserV1TransferGoogle } from '../../models/user-v1-transfer-google';

const logger = createLogger(module);

export class GoogleStrategyVerifier {
    private user: AppUserAuth | undefined;

    constructor(
		private request: Request,
		private accessToken: string,
		private refreshToken: string,
		private profile: any,
		private done: passportGoogle.VerifyCallback
    ) {

    }

    public static async buildAndRun(
		request: Request,
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: passportGoogle.VerifyCallback
    ): Promise<void> {
        const verifier = new GoogleStrategyVerifier(request, accessToken, refreshToken, profile, done);
        verifier.run();
    }

    public async run(): Promise<any> {
        try {
            const user = await this.loadOrTransferUserRecord();
            this.checkUserStatus(user);
            this.done(undefined, user);
        } catch (error: any) {
            // this.done(error, undefined);
            this.done(undefined, undefined);
        }
    }

    private async loadOrTransferUserRecord(): Promise<AppUserAuth> {
        // try {
            return await this.loadUserRecord();
        // } catch (error: any) {
            // return await this.transferUserRecord();
        // }
    }

    private async loadUserRecord(): Promise<AppUserAuth> {
        try {
            logger.debug(`load the user record for ${this.profile.email}`);
            const userData = await getUserByEmailQuery.run(this.profile.email);
            return userData;
        } catch (error) {
            logger.error('Error in loadUserRecord');
            logger.debug(util.inspect(error, {depth: null}));
            throw new AppAuthenticationError('User not found');
        }
    }

    // private async transferUserRecord(): Promise<AppUserAuth> {
    //     try {
    //         logger.debug(`transfer the user record for ${this.profile.email}`);
    //         const hasV1Record = await UserV1TransferGoogle.hasV1Account(this.profile.email);
    //         if (!hasV1Record) {
    //             throw new AppAuthenticationError('User does not have a V1 record');
    //         }
    //         return await UserV1TransferGoogle.run(this.profile.email);
    //     } catch (error) {
    //         logger.error('Error in transferUserRecord');
    //         throw error;
    //     } 

    // }

    private checkUserStatus(user: AppUserAuth): void {
        try {
            logger.debug(`Make sure the account isn't disabled for ${this.profile.email}`);
            logger.debug(util.inspect(user, {depth: null}));
            if (user.status === UserStatus.Disabled) {
                throw new AppAuthenticationError('Account is disabled');
            }
        } catch (error) {
            logger.error('Error in checkUserStatus');
            throw error;
        }
    }

}
