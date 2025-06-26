import * as util from 'util';
import { createLogger } from '../../../../logging/index';
import { AppFileQuery } from '../../../../utils/app-query';

const logger = createLogger(module);

interface QueryParams {
    x: number;
    y: number;
    z: number;
}

class GetThreatTilesQuery extends AppFileQuery {

    public run(
        params: QueryParams,
        transaction?: any
    ): Promise<any> {
        try {
            return this.runQuerySingleOrNone(params, transaction)
        }
        catch (error) {
            logger.error(`Error retrieving tiles for ${params.z}, ${params.x}, ${params.y}`);
            logger.error(util.inspect(error));
            throw error;
        }
    }

}

/** Retrieve the map tiles from a MVT data source. */
export const getThreatTilesQuery = new GetThreatTilesQuery(
    __dirname,
    'query.sql'
);
