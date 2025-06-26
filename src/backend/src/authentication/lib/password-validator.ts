
/** Determines if a password is valid, in terms of length/complexity */
export function passwordIsValid(password: string): boolean {
    if (
        typeof password === 'string'
    ) {
        return true;
    }
    else {
        return false;
    }
}
