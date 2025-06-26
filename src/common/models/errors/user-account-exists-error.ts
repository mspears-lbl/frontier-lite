import { AppError, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export const name = 'UserAccountExistsError';
export const message = 'An account already exists for the given email address.';
export class UserAccountExistsError extends AppHttpError {
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}
