import { UserStatus } from "../../../../../../../common/models/app-user";
import { AppFileQuery } from "../../../../../utils/app-query";


export interface QueryParams {
    uuid: string;
    status: UserStatus;
}

class UpdateUserStatusQuery extends AppFileQuery {

    public run(
        params: QueryParams,
        transaction?: any
    ): Promise<number> {
        try {
            return this.runQueryNumAffected(params, transaction);
        }
        catch (error) {
            console.log('error updating user status')
            console.log(error);
            throw new Error('Unable to update user status');
        }
    }

}

/** Update a users's account status */
export const updateUserStatusQuery = new UpdateUserStatusQuery(__dirname, 'update.sql');
