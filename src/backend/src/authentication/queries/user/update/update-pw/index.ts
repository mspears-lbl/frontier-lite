import { AppFileQuery } from '../../../../../utils/app-query';
import { AppUserAuth } from '../../../../models/app-user-auth';


interface IQueryParams {
    uuid: string;
    passwordHash: string;
}

class UpdateUserPasswordQuery extends AppFileQuery {

    public run(
        uuid: string,
        passwordHash: string,
        transaction?: any
    ): Promise<AppUserAuth> {
        try {
            const params: IQueryParams = { uuid, passwordHash };
            return this.runQueryNone(params, transaction);
        }
        catch (error) {
            throw error;
        }
    }

}

/** Update a user password */
export const updateUserPasswordQuery = new UpdateUserPasswordQuery(__dirname, 'update.sql');
