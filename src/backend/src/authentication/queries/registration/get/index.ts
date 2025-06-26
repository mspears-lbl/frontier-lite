import { RegistrationInfoAdmin } from '../../../../../../common/models/registration';
import { AppFileQuery } from '../../../../utils/app-query';

/** Retrieve all of the new account requests */
class GetRegistrationInfoQuery extends AppFileQuery {
    public run(
        transaction?: any
    ): Promise<RegistrationInfoAdmin[] | null> {
        return this.runQueryManyOrNone(null, transaction);
    }
}

/** Retrieve the RegistrationInfo for a given user. */
export const getRegistrationInfoQuery = new GetRegistrationInfoQuery(
    __dirname,
    'get.sql'
);
