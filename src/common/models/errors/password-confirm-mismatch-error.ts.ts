import { AppError } from ".";

export const name = 'PasswordConfirmMismatchError';
export const message = 'The passwords provided do not match.';
export class PasswordConfirmMismatchError extends AppError {
	constructor() {
		super(message);
		this.name = name;
	}
}
