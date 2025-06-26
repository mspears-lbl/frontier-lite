import * as util from 'util';
import { v4 } from 'uuid';
import { AppFileQuery } from '../../../../utils/app-query';
import { AppUserRequest, isAppUserRequest } from '../../../../../../common/models/app-user-request';
import { AppUserAuth } from '../../../../authentication/models/app-user-auth';
import { createLogger } from '../../../../logging';
import { hashPassword } from '../../../../authentication/models/password-hash';
import { UserRole, UserStatus } from '../../../../../../common/models/app-user';

const logger = createLogger(module);

interface QueryParams {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    status: UserStatus,
    password: string;
}

/** Inserts a new user record into the database */
class InsertUserQuery extends AppFileQuery {
    public async run(
        user: AppUserRequest,
        transaction?: any
    ): Promise<AppUserAuth> {
        const params = await this.buildParams(user);
        logger.debug(util.inspect(params))
        return await this.runQuerySingle(params, transaction)
        .catch((error: Error) => {
            logger.error('error running query')
            logger.debug(util.inspect(error))
            throw error;
        })
    }

    /** builds the query parameters */
    private async buildParams(
        user: AppUserRequest
    ): Promise<QueryParams> {
        // check required parameters
        if (!isAppUserRequest(user)) {
            throw new Error('Invalid parameters required to make user.');
        }
        else if (!user.password) {
            throw new Error('Password required to make user.');
        }
        const hashedPw = await hashPassword(user.password);
        return {
            uuid: user.uuid || v4(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
            password: hashedPw
        };
    }
}

/** Inserts a auth.user record into the database */
export const insertUserQuery = new InsertUserQuery(
    __dirname,
    'insert.sql'
);
