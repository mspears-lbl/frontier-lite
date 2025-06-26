import { AppError, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export const name = 'PasswordResetEmailError';
export const message = `Unable to send a message to the given email address.`;
export class PasswordResetEmailError extends AppHttpError{
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}
