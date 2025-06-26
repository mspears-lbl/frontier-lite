import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { UserAccountUpdater } from '../models/user-account-updater';
import { isUpdateAppUserDataRequest, UpdateAppUserDataRequest } from '../../../../common/models/app-user';
import { AppBadRequestError } from '../../../../common/models/errors';

const logger = createLogger(module);

export class UpdateUserAccountHandler {

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
		const handler = new UpdateUserAccountHandler(request, response, next);
		return await handler.handleRequest();
	}

	private async handleRequest(): Promise<void> {
		try {
			const params = this.getParams();
			console.log('update registration status')
			console.log(params);
			await UserAccountUpdater.run(params);
            console.log('Registration status updated!');
			this.response.status(200).send();
		} catch (error: any) {
			logger.error('error in UpdateUserAccountHandler');
			logger.debug(util.inspect(error, {depth: null}));
			this.next(error);
		}
	}

	private getParams(): UpdateAppUserDataRequest {
		const item = this.request.body;
		if (!isUpdateAppUserDataRequest(item)) {
			throw new AppBadRequestError('Invalid data')
		}
		return item;
	}

}
