import * as util from 'util';
import { createLogger } from '../../../../logging/index';
import { AppFileQuery } from '../../../../utils/app-query';
import { ThreatInfo } from '../../../../../../common/models/threat-info';

const logger = createLogger(module);

interface QueryParams {
    z: number;
    x: number;
    y: number;
}

class GetThreatInfoQuery extends AppFileQuery {

    public run(
        params: QueryParams,
        transaction?: any
    ): Promise<ThreatInfo[] | null | undefined> {
        try {
            return this.runQueryManyOrNone(params, transaction)
        }
        catch (error) {
            logger.error(`Error retrieving tiles for ${params}`);
            logger.error(util.inspect(error));
            throw error;
        }
    }

}

/** Retrieve the threat information for a given MVT tile. */
export const getThreatInfoQuery = new GetThreatInfoQuery(
    __dirname,
    'query.sql'
);
