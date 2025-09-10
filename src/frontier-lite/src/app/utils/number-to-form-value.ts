
export function numberToFormValuePercent(value: number | null | undefined): number | null | undefined {
    if (value === null || value === undefined) {
        return value;
    }
    return value * 100;
}
