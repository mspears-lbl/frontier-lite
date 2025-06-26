import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { isThreatDataRequest, ThreatDataRequest } from '../../../../common/models/threat-data';
import { AppBadRequestError } from '../../../../common/models/errors';
import { getThreatTilesQuery } from '../queries/threat-data/get';

const logger = createLogger(module);

export class GetThreatDataHandler {

    constructor(
        private request: Request,
        private response: Response,
        private next: NextFunction
    ) {
    }

    public static async handleRequest(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<any> {
        const handler = new GetThreatDataHandler(request, response, next);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug('retrieve the threat data...');
            const params = this.getParams();
            const results = await getThreatTilesQuery.run(params);
            // const results = {data: 'abcdefg', params};
            console.log(results?.st_asmvt);
            this.response.setHeader('Content-Type', 'application/x-protobuf');
            this.response.send(results?.st_asmvt);
            // this.response.json(results);
        } catch (error) {
            logger.error('Error in GetThreatDataHandler');
            logger.debug(util.inspect(error))
            this.next(error);
        }
    }

    // private getParams(): ThreatDataRequest {
    //     const params = this.request.body;
    //     if (!isThreatDataRequest(params)) {
    //         throw new AppBadRequestError();
    //     }
    //     return params;
    // }

        private getParams(): any {
        const params = {
            x: +this.request.params.x,
            y: +this.request.params.y,
            z: +this.request.params.z,
            // threatScenarioId: +this.request.params.threatScenarioId,
            // territoryRegionId: +this.request.params.territoryRegionId,
        }
        if (!Number.isNaN(params.x) && !Number.isNaN(params.y) && !Number.isNaN(params.z)) {
            return params;
        }
        else {
            throw new AppBadRequestError();
        }
    }

}
