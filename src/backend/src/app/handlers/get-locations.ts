import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { AppBadRequestError } from '../../../../common/models/errors';
import { findLocations } from '../models/location-finder';
import { FindLocationsRequest, isFindLocationsRequest } from '../../../../common/models/find-locations';

const logger = createLogger(module);

export class GetLocationsHandler {

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
        const handler = new GetLocationsHandler(request, response, next);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug('get locations...');
            const params = this.getParams();
            logger.debug(util.inspect(params, {depth: null}));
            const results = await findLocations(params.query);
            logger.debug(util.inspect(results, {depth: null}));
            this.response.json({results: results || []});
        } catch (error) {
            logger.error('Error in GetLocationsHandler');
            logger.debug(util.inspect(error))
            this.next(error);
        }
    }

    private getParams(): FindLocationsRequest {
        const params = this.request.body;
        if (isFindLocationsRequest(params)) {
            return params;
        }
        else {
            throw new AppBadRequestError();
        }
    }

}

// console.log('test locations...');
// findLocations('guam').then((results) => {
//     console.log(util.inspect(results, {depth: null}));
// }).catch(err => {
//     console.log(`error finding locatino...`);
//     console.log(err);
// })