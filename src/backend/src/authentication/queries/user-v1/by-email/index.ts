import * as util from 'util';
import { createLogger } from '../../../../logging';
import { AppFileQuery } from '../../../../utils/app-query';
import { UserV1Record } from '../../../models/user-v1';
import { AppDatabaseError } from '../../../../../../common/models/errors';

const logger = createLogger(module);

interface IQueryParams {
    email: string;
}

class GetUserV1ByEmailQuery extends AppFileQuery {

    public run(
        email: string,
        transaction?: any
    ): Promise<UserV1Record> {
        try {
            const params: IQueryParams = { email };
            return this.runQuerySingle(params, transaction)
        }
        catch (error) {
            logger.error(`Unable to retrieve user ${email}`);
            logger.error(util.inspect(error));
            throw new AppDatabaseError(`Unable to retrieve user for email ${email}`);
        }
    }

}

/** Search for a V1 user record by email address */
export const getUserV1ByEmailQuery = new GetUserV1ByEmailQuery(__dirname, 'get.sql');
