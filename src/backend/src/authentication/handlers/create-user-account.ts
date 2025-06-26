import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { CreateAccountRequest, isCreateAccountRequest } from '../../../../common/models/account-request';
import { CreateUserAccountRequest, isCreateUserAccountRequest } from '../../../../common/models/registration';
import { AppAccountCreator } from '../models/account-creator';

const logger = createLogger(module);

export class CreateUserAccountInfoHandler {

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
		const handler = new CreateUserAccountInfoHandler(request, response, next);
		return await handler.handleRequest();
	}

	private async handleRequest(): Promise<void> {
		try {
			const params = this.getParams();
			console.log('registrationInfo')
			console.log(params);
            await AppAccountCreator.run(params);
            // console.log('confirmation result = ', result);
            // this.response.send(result);
			this.response.status(200).send();
		} catch (error: any) {
			logger.error('error in CreateUserAccountInfoHandler');
			logger.debug(util.inspect(error, {depth: null}));
			logger.error('error in CreateIrpHandler');
			this.next(error);
		}
	}

	private getParams(): CreateUserAccountRequest {
		const item = this.request.body;
		if (!isCreateUserAccountRequest(item)) {
			throw new Error('invalid request');
		}
		return item;
	}

}
