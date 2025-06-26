import * as util from 'util';
import { AppFileQuery } from '../../../../utils/app-query';
import { createLogger } from '../../../../logging';
import { isRegistrationInfo, RegistrationInfo } from '../../../../../../common/models/registration';

const logger = createLogger(module);

interface QueryParams {
    data: RegistrationInfo;
}

/** Inserts a new RegistrationInfo into the database */
class InsertRegistrationInfoQuery extends AppFileQuery {
    public async run(
        params: RegistrationInfo,
        transaction?: any
    ): Promise<{id: number}> {
        if (!isRegistrationInfo(params)) {
            throw new Error('Expected to have a valid registration params');
        }
        const queryParams: QueryParams = {
            data: params
        }
        return await this.runQuerySingle(queryParams, transaction);
    }

}

/** Inserts a new service territory record into the database */
export const insertRegistrationInfoQuery = new InsertRegistrationInfoQuery(
    __dirname,
    'insert.sql'
);
