
/**
 * Returns a trimmed string if the given value is a string,
 * otherwise returns the original value.
 */
export function trimIfString(value: any): any {
    return typeof value === 'string'
        ? value.trim()
        : value
    ;
}
