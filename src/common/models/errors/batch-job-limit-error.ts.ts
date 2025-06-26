import { AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";
import { JOB_COUNT_MAX } from  '../ice-model/confidence-interval';

export const name = 'BatchJobLimitError';
export const message = `There are too many jobs running for the current user. Users are limited to ${JOB_COUNT_MAX} concurrent CI calculations at a time.`;
export class BatchJobLimitError extends AppHttpError {
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}
