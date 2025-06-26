import { AppFileQuery } from '../../../../../utils/app-query';
import { AppUserAuth } from '../../../../models/app-user-auth';
import * as util from 'util';
import { createLogger } from '../../../../../logging';

const logger = createLogger(module);

interface IQueryParams {
    email: string;
}

class GetUserByEmailQuery extends AppFileQuery {

    public run(
        email: string,
        transaction?: any
    ): Promise<AppUserAuth> {
        try {
            const params: IQueryParams = { email };
            return this.runQuerySingle(params, transaction)
        }
        catch (error) {
            logger.error(`Unable to retrieve user ${email}`);
            logger.error(util.inspect(error));
            throw Error(`Unable to retrieve user for email ${email}`);
        }
    }

}

/** Search for a user by email address */
export const getUserByEmailQuery = new GetUserByEmailQuery(__dirname, 'get.sql');
