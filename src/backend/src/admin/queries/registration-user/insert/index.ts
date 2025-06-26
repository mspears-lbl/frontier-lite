import * as util from 'util';
import { AppFileQuery } from '../../../../utils/app-query';
import { createLogger } from '../../../../logging';

const logger = createLogger(module);

interface QueryParams {
    userId: string;
    registrationId: string;
}

/** Inserts a new record linking a user with a registration.*/
class InsertRegisteredUserQuery extends AppFileQuery {
    public async run(
        params: QueryParams,
        transaction?: any
    ): Promise<{id: number}> {
        return await this.runQuerySingle(params, transaction);
    }

}

/** Inserts a new record linking a user with a registration.*/
export const insertRegisteredUserQuery = new InsertRegisteredUserQuery(
    __dirname,
    'insert.sql'
);
