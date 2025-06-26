import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { AppBadRequestError } from '../../../../common/models/errors';
import { getThreatInfoQuery } from '../queries/threat-info/get';

const logger = createLogger(module);

export class GetThreatInfoHandler {

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
        const handler = new GetThreatInfoHandler(request, response, next);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug('retrieve the threat info...');
            const params = this.getParams();
            logger.debug(util.inspect(params, {depth: null}));
            // const results = await getThreatTilesQuery.run(params);
            const results = await getThreatInfoQuery.run(params);
            logger.debug(util.inspect(results, {depth: null}));
            this.response.json(results || []);
        } catch (error) {
            logger.error('Error in GetThreatInfoHandler');
            logger.debug(util.inspect(error))
            this.next(error);
        }
    }

    private getParams(): any {
        const params = {
            x: +this.request.params.x,
            y: +this.request.params.y,
            z: +this.request.params.z
        };
        if (!Number.isNaN(params.x) && !Number.isNaN(params.y) && !Number.isNaN(params.z)) {
            return params;
        }
        else {
            throw new AppBadRequestError();
        }
    }

}
