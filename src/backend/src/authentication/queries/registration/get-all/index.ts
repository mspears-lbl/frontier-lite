import { RegistrationInfo } from '../../../../../../common/models/registration';
import { AppFileQuery } from '../../../../utils/app-query';

/** Retrieve all of the new account requests */
class GetRegistrationInfoAllQuery extends AppFileQuery {
    public run(
        transaction?: any
    ): Promise<RegistrationInfo[] | null> {
        return this.runQueryManyOrNone(null, transaction);
    }
}

/** Retrieve the all of the RPP registration info. */
export const getRegistrationInfoAllQuery = new GetRegistrationInfoAllQuery(
    __dirname,
    'get.sql'
);
