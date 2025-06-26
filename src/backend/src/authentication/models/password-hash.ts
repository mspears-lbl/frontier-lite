import * as bcrypt from 'bcryptjs';
import * as util from 'util';
import { createLogger } from '../../logging/index';

const logger = createLogger(module);

export abstract class UserPasswordHash {
    constructor(
        public password: string
    ) {}

    /**
     * Make sure the password isn't blank.
     * @returns true if the password is valid, false if it's not valid.
     */
    public isValid(): boolean {
        if (this.password && this.password.trim()) {
            return true;
        }
        else {
            return false;
        }
    }

    public hashPassword(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!this.isValid()) {
                reject('Invalid UserPasswordHash');
            }
            else {
                return resolve(hashPassword(this.password));
            }
        });
    }
}

/** Creates a password hash to save into the database */
export function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 12, (error, passwordHash) => {
            if (error) {
                logger.debug('Error in UserPasswordUpdate - hash');
                logger.error(util.inspect(error));
                reject();
            }
            resolve(passwordHash);
        });
    });
}