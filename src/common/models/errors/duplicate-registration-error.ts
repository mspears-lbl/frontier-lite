import { AppError, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export const name = 'DuplicateRegistrationError';
export const message = 'Registration has already been submitted for the given email address.';
export class DuplicateRegistrationError extends AppHttpError {
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}