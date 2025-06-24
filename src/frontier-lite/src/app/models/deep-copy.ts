
/**
 * Creates a deep copy of the given object.
 * @param obj The object to copy.
 * @returns A deep copy of the given object.
 */
export function deepCopy<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }

    if (obj instanceof Array) {
        return obj.map(item => deepCopy(item)) as any;
    }

    if (obj instanceof Object) {
        const copy: any = {};
        Object.keys(obj).forEach(key => {
            copy[key] = deepCopy((obj as any)[key]);
        });
        return copy;
    }

    throw new Error(`Unable to copy obj! Its type isn't supported.`);
}
