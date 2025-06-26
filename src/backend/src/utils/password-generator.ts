import pGen from 'generate-password';

/** Create's a random password that's 20 characters long. */
export function generatePassword(): string {
	return pGen.generate({length: 20, numbers: true});
}