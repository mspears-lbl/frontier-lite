// import { Request, Response } from 'express';
// import { WelderError } from '../../../../welder-common/welder-error/index';
// import { createLogger } from '../../logging/index';
// import * as util from 'util';
// import { HttpStatusCodes } from '../../../../welder-common/enums/http-status-codes';

// const logger = createLogger(module);

// export function errorHandler(
//     err: any,
//     request: Request,
//     response: Response,
//     next: (err: Error | WelderError, request: Request, response: Response, next: Function) => void
// ) {
//     logger.debug('global error handler');
//     logger.debug(util.inspect(err, {depth: null}));
//     response.status(HttpStatusCodes.ServerError_500).send();
// }
