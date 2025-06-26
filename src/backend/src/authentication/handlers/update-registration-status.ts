import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { UpdateRegistrationStatusRequest, isUpdateRegistrationStatusRequest } from '../../../../common/models/registration';
import { updateRegistrationStatusQuery } from '../queries/registration/update';

const logger = createLogger(module);

export class UpdateRegistrationStatusHandler {

	private constructor(
		private request: Request,
		private response: Response,
		private next: NextFunction
	) {
	}

	public static async handleRequest(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<void> {
		const handler = new UpdateRegistrationStatusHandler(request, response, next);
		return await handler.handleRequest();
	}

	private async handleRequest(): Promise<void> {
		try {
			const params = this.getParams();
			console.log('update registration status')
			console.log(params);
			await updateRegistrationStatusQuery.run(params);
            console.log('Registration status updated!');
			this.response.status(200).send();
		} catch (error: any) {
			logger.error('error in UpdateRegistrationStatusHandler');
			logger.debug(util.inspect(error, {depth: null}));
			this.next(error);
		}
	}

	private getParams(): UpdateRegistrationStatusRequest {
		const item = this.request.body;
		if (!isUpdateRegistrationStatusRequest(item)) {
			throw new Error('invalid request');
		}
		return item;
	}

}
