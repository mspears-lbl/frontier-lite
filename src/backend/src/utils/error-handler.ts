import { NextFunction, Request, Response } from 'express';
import { AppError, AppErrorCode, AppHttpError } from '../../../common/models/errors';
import { HttpStatusCode } from '../../../common/models/http-status-codes';
import { createLogger } from '../logging';
import * as util from 'util';

const logger = createLogger(module);

export function logErrors(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack)
	logger.debug(util.inspect(err, {depth: null}));
    next(err)
}

export function errorResponse(err: any, req: Request, res: Response, next: NextFunction) {
	if (err instanceof AppHttpError) {
		res.status(err.statusCode)
			.json({ message: err.message, code: err.errorCode });
	}
	else if (err instanceof AppError) {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json({ message: err.message, code: err.errorCode });
	}
	else {
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
			.json({ message: 'Internal server error', code: AppErrorCode.SERVER_UNHANDLED_ERROR });
	}
}
