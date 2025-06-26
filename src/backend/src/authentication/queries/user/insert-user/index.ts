import * as util from 'util';
import { createLogger } from '../../../../logging';
import { AppFileQuery } from '../../../../utils/app-query';
import { IDRecord } from '../../../../models/id-record';
import { CreateUserAccountRequest, isCreateUserAccountRequest } from '../../../../../../common/models/registration';
import { v4 } from 'uuid';
import { hashPassword } from '../../../models/password-hash';
import { CreateAccountRequest, isCreateAccountRequest } from '../../../../../../common/models/account-request';

const logger = createLogger(module);

interface QueryParams extends CreateAccountRequest {
    password: string;
}

/** Inserts a new base user record. */
class InsertUserQuery extends AppFileQuery {
    public async run(
        params: CreateAccountRequest,
        transaction?: any
    ): Promise<IDRecord> {
        if (!isCreateAccountRequest(params)) {
            throw new Error('Invalid data');
        }
        const queryParams: QueryParams = {
            ...params,
            password: await hashPassword(v4())
        }
        return await this.runQuerySingle(queryParams, transaction);
    }

}

/** Inserts a new user record into the database */
export const insertUserQuery = new InsertUserQuery(
    __dirname,
    'insert.sql'
);
