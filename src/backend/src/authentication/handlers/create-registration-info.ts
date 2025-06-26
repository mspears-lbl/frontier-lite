import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { RegistrationConfirmor } from '../models/registration-confirmor';
import { CreateAccountRequest, isCreateAccountRequest } from '../../../../common/models/account-request';

const logger = createLogger(module);

export class CreateRegistrationInfoHandler {

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
		const handler = new CreateRegistrationInfoHandler(request, response, next);
		return await handler.handleRequest();
	}

	private async handleRequest(): Promise<void> {
		try {
			const params = this.getParams();
			console.log('registrationInfo')
			console.log(params);
            const result = await RegistrationConfirmor.runUserConfirmation(params);
            console.log('confirmation result = ', result);
            this.response.send(result);
		} catch (error: any) {
			logger.error('error in CreateRegistrationInfoHandler');
			logger.debug(util.inspect(error, {depth: null}));
			this.next(error);
		}
	}

	private getParams(): CreateAccountRequest {
		const item = this.request.body;
		if (!isCreateAccountRequest(item)) {
			throw new Error('invalid request');
		}
		return item;
	}

}
