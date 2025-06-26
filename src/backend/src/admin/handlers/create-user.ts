import { Request, Response } from 'express';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { UserCreator } from '../models/user-creator';
import { AppUserRequest, AppUserRequestRegistered, isAppUserRequest, isAppUserRequestRegistered } from '../../../../common/models/app-user-request';
import { toAppUser } from '../../authentication/models/app-user-auth';
import { generatePassword } from '../../utils/password-generator';

const logger = createLogger(module);

export class CreateUserHandler {
    constructor(
        private request: Request,
        private response: Response
    ) {
    }

    public static async handleRequest(
        request: Request,
        response: Response
    ): Promise<any> {
        console.log('handle request...');
        const handler = new CreateUserHandler(request, response);
        return handler.run();
    }

    public async run(): Promise<any> {
        try {
            logger.debug(`CreateUser:`);
            const params = this.getParams();
            const result = await UserCreator.run(params);
            console.log(`created user ${params.email} with password "${params.password}"`);
            this.response.json(result);
        } catch (error) {
            logger.error('Error in CreateUserHandler');
            logger.debug(util.inspect(error))
            this.response.status(500).send();
        }
    }

    private getParams(): AppUserRequestRegistered {
        const params: AppUserRequestRegistered = {...this.request.body};
        logger.debug('get params...');
        console.log(util.inspect(params, {depth: null}));
        if (!isAppUserRequestRegistered(params)) {
            throw new Error('Invalid parameters');
        }
        return this.getParamsWithPassword(params);
    }

    /** Generates a new password if one is not provided. */
    private getParamsWithPassword(params: AppUserRequestRegistered): AppUserRequestRegistered {
        return params.password
            ? params
            : {
                ...params,
                password: generatePassword()
            }
    }

}
