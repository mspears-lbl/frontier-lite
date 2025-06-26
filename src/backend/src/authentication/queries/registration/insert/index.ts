import * as util from 'util';
import { AppFileQuery } from '../../../../utils/app-query';
import { createLogger } from '../../../../logging';
import { CreateAccountRequest, isCreateAccountRequest } from '../../../../../../common/models/account-request';

const logger = createLogger(module);

/** Inserts a new RegistrationInfo into the database */
class InsertRegistrationInfoQuery extends AppFileQuery {
    public async run(
        params: CreateAccountRequest,
        transaction?: any
    ): Promise<{id: number}> {
        if (!isCreateAccountRequest(params)) {
            throw new Error('Expected to have a valid registration params');
        }
        return await this.runQuerySingle(params, transaction);
    }

}

/** Inserts a new RegistrationInfo record in the database. */
export const insertRegistrationInfoQuery = new InsertRegistrationInfoQuery(
    __dirname,
    'insert.sql'
);
