
/** Escape a string to be used in a regex SQL query */
export function escapeRegExp(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}