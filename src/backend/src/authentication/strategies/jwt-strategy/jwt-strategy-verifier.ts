import { NextFunc } from '../../types/next-function';
import { createLogger } from '../../../logging/index';
// import { getUserByUuidQuery } from '@welder-backend/authentication/queries/user/get/by-uuid';
// import { WUserNotFoundError } from '@welder-common/welder-error/welder-auth-error/user-not-found.error';
import { JwtPayload } from '../../models/jwt-payload';
import { getUserByUuidQuery } from '../../queries/user/get/by-uuid';
import { AppUserAuth } from '../../models/app-user-auth';
import * as util from 'util';

const logger = createLogger(module);

export class JwtStrategyVerifier {
    private user: AppUserAuth | undefined;

    constructor(
        private payload: JwtPayload,
        private next: NextFunc
    ) {

    }

    public static async buildAndRun(
        payload: JwtPayload,
        next: NextFunc
    ): Promise<any> {
        const verifier = new JwtStrategyVerifier(payload, next);
        return verifier.run();
    }

    public async run(): Promise<any> {
        try {
            await this.loadUserRecord();
        } catch (error) {
        }
        return this.done();
    }

    private async loadUserRecord(): Promise<void> {
        try {
            console.log(`find the user record for ${this.payload.uuid}`);
            this.user = await getUserByUuidQuery.run(this.payload.uuid);
        } catch (error) {
            logger.error('Error in loadUserRecord');
            // throw new WUserNotFoundError({uuid: this.payload, origError: error});
            logger.error(util.inspect(error, {depth: null}));
            throw new Error('Error locating user record');
        }
    }

    private done(): void {
        logger.debug(`done, success = ${this.user ? true : false}`);
        return this.user
            ? this.next(null, this.user)
            : this.next(new Error('Error loading user'), undefined);
    }
}
