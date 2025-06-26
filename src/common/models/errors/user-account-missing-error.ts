import { AppError } from ".";

export const name = 'UserAccountMissingError';
export const message = `A user account doesn't exist for the email address provided.`;
export class UserAccountMissingError extends AppError {
	constructor() {
		super(message);
		this.name = name;
	}
}
