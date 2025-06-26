import { RegistrationInfoAdmin } from '../../../../../../common/models/registration';
import { AppFileQuery } from '../../../../utils/app-query';

/** Retrieve the new account request for a given email. */
class GetRegistrationInfoByEmailQuery extends AppFileQuery {
    public run(
        email: string,
        transaction?: any
    ): Promise<RegistrationInfoAdmin | null> {
        return this.runQuerySingleOrNone({email}, transaction);
    }
}

/** Retrieve the new account request for a given email. */
export const getRegistrationInfoByEmailQuery = new GetRegistrationInfoByEmailQuery(
    __dirname,
    'get.sql'
);
