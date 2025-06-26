import { RegistrationInfoAdmin } from '../../../../../../common/models/registration';
import { AppFileQuery } from '../../../../utils/app-query';

interface QueryParams {
    id: string;
}

/** Retrieve the RegistrationInfo for a given user by the id. */
class GetRegistrationInfoByIdQuery extends AppFileQuery {
    public run(
        params: QueryParams,
        transaction?: any
    ): Promise<RegistrationInfoAdmin> {
        return this.runQuerySingle(params, transaction);
    }
}

/** Retrieve the RegistrationInfo for a given user by the id. */
export const getRegistrationInfoByIdQuery = new GetRegistrationInfoByIdQuery(
    __dirname,
    'get.sql'
);
