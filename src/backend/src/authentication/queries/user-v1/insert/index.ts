import * as util from 'util';
import { createLogger } from '../../../../../../backend/src/logging';
import { AppFileQuery } from '../../../../utils/app-query';
import { IDRecord } from '../../../../models/id-record';
import { toUserStatusV2, UserV1Data } from '../../../models/user-v1';
import { UserStatus } from '../../../../../../common/models/app-user';

const logger = createLogger(module);
interface QueryParams extends UserV1Data {
    statusV2: UserStatus;
}

/** Inserts a user record from v1 into the v2 database */
class InsertUserV1Query extends AppFileQuery {
    public async run(
        params: UserV1Data,
        transaction?: any
    ): Promise<IDRecord> {
        const queryParams: QueryParams = {
            ...params,
            statusV2: toUserStatusV2(params.status)
        };
        console.log(params);
        return await this.runQuerySingle(queryParams, transaction);
    }
}

/** Inserts a user record from v1 into the v2 database */
export const insertUserV1Query = new InsertUserV1Query(
    __dirname,
    'insert.sql'
);
