import * as bcrypt from 'bcryptjs';

/**
 * Compares two password strings using the bcrypt library,
 * where either one of the passwords can be the hashed version
 * stored in the db.
 * @returns true if the passwords are equal, false if they're not.
 */
export function comparePassword(
    passwordToCheck: string,
    hashedPassword: string
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(passwordToCheck, hashedPassword, (err: Error | null, isValid: boolean) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(isValid);
            }
        });
    });
}
