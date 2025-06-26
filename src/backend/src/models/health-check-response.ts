
/** The object signature from a health check response. */
export interface HealthCheckResponse {
	healthy: true;
}

export function isHealthCheckResponse(obj: any): obj is HealthCheckResponse {
	return obj?.healthy === true;
}
