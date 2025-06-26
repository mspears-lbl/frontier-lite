import { AppError } from ".";

export const name = 'PasswordInvalidError';
export const message = 'Passwords should be between 6 and 32 characters.';
export class PasswordInvalidError extends AppError {
	constructor() {
		super(message);
		this.name = name;
	}
}
