
export interface FindLocationsRequest {
    query: string;
}

export const FindLocationMaxLength = 100;

export function isFindLocationsRequest(value: any): value is FindLocationsRequest {
    return (
        value &&
        typeof value.query === 'string' &&
        value.query.length > 0 &&
        value.query.length < FindLocationMaxLength
    ) ? true : false;
}

export interface LocationResult {
    name: string;
    latitude: number;
    longitude: number;
    mapView: number[] | null | undefined
}

export interface FindLocationsResponse {
    results: LocationResult[];
}
