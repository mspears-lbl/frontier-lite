import { RegistrationInfo } from '../../../../../../common/models/registration';
import { AppFileQuery } from '../../../../utils/app-query';
import { AppUserListData } from '../../../../../../common/models/app-user-list';

/** Retrieve an object containing all of the RPP users. */
class GetUserListQuery extends AppFileQuery {
    public run(
        transaction?: any
    ): Promise<AppUserListData | null> {
        return this.runQuerySingle(null, transaction);
    }
}

/** Retrieve an object containing all of the RPP users. */
export const getUserListQuery = new GetUserListQuery(
    __dirname,
    'get.sql'
);
