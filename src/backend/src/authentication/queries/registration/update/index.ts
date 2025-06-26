import * as util from 'util';
import { AppFileQuery } from '../../../../utils/app-query';
import { createLogger } from '../../../../logging';
import { UpdateRegistrationStatusRequest } from '../../../../../../common/models/registration';

const logger = createLogger(module);

/** Updates a the status of a registration record. */
class UpdateRegistrationStatusQuery extends AppFileQuery {
    public async run(
        params: UpdateRegistrationStatusRequest,
        transaction?: any
    ): Promise<number> {
        return await this.runQueryNumAffected(params, transaction);
    }
}

/** Updates a RegistrationStatus record. */
export const updateRegistrationStatusQuery = new UpdateRegistrationStatusQuery(
    __dirname,
    'update.sql'
);
