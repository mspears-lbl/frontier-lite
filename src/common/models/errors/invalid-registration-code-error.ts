import { AppError, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export const name = 'InvalidRegistrationCodeError';
export const message = 'Invalid registration code.';
export class InvalidRegistrationCodeError extends AppHttpError {
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}