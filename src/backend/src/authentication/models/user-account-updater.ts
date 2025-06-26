import { isUpdateAppUserDataRequest, UpdateAppUserDataRequest, UserRole } from "../../../../common/models/app-user";
import { AppBadRequestError } from "../../../../common/models/errors";
import { UserUpdateAdminError} from "../../../../common/models/errors/user-update-admin";
import { createLogger } from "../../logging";
import { updateUserInfoQuery } from "../queries/user/update/update-info";
import * as util from 'util';

const logger = createLogger(module);

export class UserAccountUpdater {
    constructor(
        private params: UpdateAppUserDataRequest
    ){
    }

    public static async run(params: UpdateAppUserDataRequest): Promise<void> {
        await new UserAccountUpdater(params).run();
    }

    private async run(): Promise<void> {
        this.validateData();
        await this.updateRecord();
    }

    private validateData(): void {
        // make sure the params are valid
        if (!isUpdateAppUserDataRequest(this.params)) {
            throw new AppBadRequestError('Invalid request data');
        }
        // make sure that users are not being set as Admins
        else if (this.params.role === UserRole.Admin) {
            throw new UserUpdateAdminError();
        }
    }

    private async updateRecord(): Promise<void> {
        // update the record
        try {
            const affected = await updateUserInfoQuery.run(this.params);
            logger.debug(`updated ${affected} records`);
        } catch (error: any) {
            logger.error(`error updating the user record:`);
            logger.error(util.inspect(error, {depth: null}));
        }
    }

}
