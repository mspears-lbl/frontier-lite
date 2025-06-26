import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import { db } from '../../db';
import { HealthCheckResponse } from '../../models/health-check-response';
import { AppHealthCheckError } from '../../../../common/models/errors';

const logger = createLogger(module);

export async function healthCheckHandler(
	request: Request,
	response: Response,
	next: NextFunction
): Promise<void> {
	try {
		const result = await db.one('select 1 as healthy');
		if (result.healthy !== 1) {
			throw new AppHealthCheckError('Health check failed');
		}
		const responseData: HealthCheckResponse = {healthy: true};
		response.send(responseData);
	} catch (error: any) {
		logger.error('error in health check');
		next(error);
	}
}
