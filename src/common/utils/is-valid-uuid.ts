
/**
 * Determines if a given string is a valid UUID
 * @param uuid 
 * @returns true if valid uuid 
 */
export function isValidUUID(uuid: string): boolean {
    if (
        typeof uuid === 'string'
        && uuid.match(/[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}/)
    ) {
        return true;
    }
    else {
        return false;
    }
}
