import { AppError, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export const name = 'UserUpdateAdminError';
export const message = 'Users cannot be set as Administrators through the application.';
export class UserUpdateAdminError extends AppHttpError {
	constructor() {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = name;
	}
}
