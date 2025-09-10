
/**
 * Create a number value from a form controls input value.
 * @param value The value to convert to a number.
 * @returns The number value, or null if the value is not a number.
 */
export function formValueToNumber(value: any): number | null {
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim()) {
        return +(value.replace(/,|\s/g, ''));
    }
    return null;
}

/**
 * Create a number value from a form controls input value that's displayed a a percentage (ie a value * 100).
 * @param value The value to convert to a number.
 * @returns The number value, or null if the value is not a number.
 */
export function formValuePercentageToNumber(value: any): number | null {
    if (typeof value === 'number' && !Number.isNaN(value)) {
        return value / 100;
    }
    if (typeof value === 'string') {
        return +value / 100;
    }
    return null;
}
