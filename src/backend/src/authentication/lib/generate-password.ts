import * as pwGenerator from 'generate-password';

/** Generates a "random" user password */
export function generatePassword(): string {
    return pwGenerator.generate({
        length: 20
    })
}
