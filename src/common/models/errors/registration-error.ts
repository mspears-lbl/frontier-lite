import * as dup from './duplicate-registration-error';
import * as code from './invalid-registration-code-error';
import * as exists from './user-account-exists-error';

export function getRegistrationErrorInfo(name: string): string {
	if (name === dup.name) {
		return dup.message;
	}
	else if (name === code.name) {
		return code.message;
	}
	else if (name === exists.name) {
		return exists.message;
	}
	else {
		return 'There was an error submitting your registration, please try again later.';
	}
}