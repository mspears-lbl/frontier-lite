import { AppFileQuery } from '../../../../../utils/app-query';
import { AppUserAuth } from '../../../../models/app-user-auth';


interface IQueryParams {
    uuid: string;
}

class GetUserByUuidQuery extends AppFileQuery {

    public run(
        uuid: string,
        transaction?: any
    ): Promise<AppUserAuth> {
        try {
            const params: IQueryParams = { uuid };
            return this.runQuerySingle(params, transaction);
        }
        catch (error) {
            throw error;
        }
    }

}

/** Search for a user by uuid */
export const getUserByUuidQuery = new GetUserByUuidQuery(__dirname, 'get.sql');
