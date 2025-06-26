import { NextFunction, Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { getUserFromRequest } from '../lib/get-user-from-request';
import { UserRole } from '../../../../common/models/app-user';
import { AppPermissionError } from '../../../../common/models/errors';
import { getUserListQuery } from '../queries/user/get-all';

const logger = createLogger(module);

export class GetUserListHandler {

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
		const handler = new GetUserListHandler(request, response, next);
		return await handler.handleRequest();
	}

	private async handleRequest(): Promise<void> {
		try {
			console.log('get user list');
			const user = getUserFromRequest(this.request);
			if (user.role !== UserRole.Admin) {
				throw new AppPermissionError('Unauthorized user');
			}
            const results = await getUserListQuery.run();
            this.response.send({results});
		} catch (error: any) {
			logger.error('error in GetUserListHandler');
			logger.debug(util.inspect(error, {depth: null}));
			this.next(error);
		}
	}

}
