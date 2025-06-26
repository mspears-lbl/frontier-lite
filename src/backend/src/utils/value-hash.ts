import { createHash } from 'node:crypto'

/** Create a hash of a value */
export function hashValue(value: any): string {
	return createHash('md5').update(value).digest('hex');
}
