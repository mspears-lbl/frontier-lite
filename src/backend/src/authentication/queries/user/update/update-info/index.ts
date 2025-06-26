import { UpdateAppUserDataRequest } from "../../../../../../../common/models/app-user";
import { AppFileQuery } from "../../../../../utils/app-query";


class UpdateUserInfoQuery extends AppFileQuery {

    public run(
        params: UpdateAppUserDataRequest,
        transaction?: any
    ): Promise<void> {
        try {
            return this.runQueryNone(params, transaction);
        }
        catch (error) {
            console.log('error updating user info')
            console.log(error);
            throw new Error('Unable to update user info');
        }
    }

}

/** Update a users's account information */
export const updateUserInfoQuery = new UpdateUserInfoQuery(__dirname, 'update.sql');
