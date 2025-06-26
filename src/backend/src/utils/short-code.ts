
const digits = "0123456789";
/**
 * Builds a 6-digit "random" code.
 * @returns a 6-digit code
 */
export function getShortCode(): string {
	// generates a 6-digit number
	let string = "";
	for (let i = 0; i < 6; i++) {
		string += digits[Math.floor(Math.random() * digits.length)];
	}
	return string;
}