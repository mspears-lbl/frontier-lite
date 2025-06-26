import * as util from 'util';
import { v4 } from 'uuid';
import { AppFileQuery } from '../../../../utils/app-query';
import { AppUserRequest, isAppUserRequest } from '../../../../../../common/models/app-user-request';
import { AppUserAuth } from '../../../../authentication/models/app-user-auth';
import { createLogger } from '../../../../logging';
import { hashPassword } from '../../../../authentication/models/password-hash';

const logger = createLogger(module);

interface IQueryParams {
    uuid: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

/** Inserts a new user record into the database */
class InsertUserAdminQuery extends AppFileQuery {
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
        user: AppUserRequest,
    ): Promise<IQueryParams> {
        // check required parameters
        if (!isAppUserRequest(user)) {
            throw new Error('Invalid parameters required to make user.')
        }
        const hashedPw = await hashPassword(user.password);
        return {
            uuid: user.uuid || v4(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: hashedPw
        };
    }
}

/** Inserts a auth.user record into the database */
export const insertUserAdminQuery = new InsertUserAdminQuery(
    __dirname,
    'insert.sql'
);
