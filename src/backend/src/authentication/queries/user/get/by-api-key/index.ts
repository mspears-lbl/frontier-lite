import { AppFileQuery } from '../../../../../utils/app-query';
import { AppUserAuth } from '../../../../models/app-user-auth';


interface QueryParams {
    apiKey: string;
}

class GetUserByApiKeyQuery extends AppFileQuery {

    public run(
        params: QueryParams,
        transaction?: any
    ): Promise<AppUserAuth> {
        try {
            return this.runQuerySingle(params, transaction);
        }
        catch (error) {
            throw error;
        }
    }

}

/** Search for a user by an API Key*/
export const getUserByApiKeyQuery = new GetUserByApiKeyQuery(__dirname, 'get.sql');
