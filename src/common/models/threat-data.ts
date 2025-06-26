
export interface ThreatDataRequest {
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    }
}

export function isThreatDataRequest(value: any): value is ThreatDataRequest {
    return (
        typeof value === 'object' &&
        value !== null &&
        typeof value.bounds === 'object' &&
        value.bounds !== null &&
        typeof value.bounds.north === 'number' &&
        typeof value.bounds.south === 'number' &&
        typeof value.bounds.east === 'number' &&
        typeof value.bounds.west === 'number'
    ) ? true : false;
}
