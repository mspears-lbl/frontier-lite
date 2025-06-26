import { AppError, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export const name = 'PasswordResetCodeMismatchError';
export const message = 'The provided token is either invalid or has expired, please try again.';
export class PasswordResetCodeMismatchError extends AppHttpError{
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}
