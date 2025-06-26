import { HttpStatusCode } from '../http-status-codes';

export enum AppErrorCode {
    HEALTH_CHECK_ERROR = 1000,  // 1000-1999 for health/monitoring
    BAD_REQUEST_ERROR = 2000,   // 2000-2999 for client errors
    SERVER_ERROR = 3000,        // 3000-3999 for server errors
	SERVER_UNHANDLED_ERROR=3010,

	// Database errors (4000-4999)
    DATABASE_ERROR = 4000,
	DATABASE_CONNECTION_ERROR = 4001,
	DATABASE_QUERY_ERROR = 4002,
	DATABASE_CONSTRAINT_ERROR = 4003,

	// Authentication errors (5000-5999)
    AUTHENTICATION_ERROR = 5000,
	INVALID_CREDENTIALS = 5001,
	TOKEN_EXPIRED = 5002,
	TOKEN_INVALID = 5003,
	API_KEY = 5010,

	// Permission errors (6000-6999)
    PERMISSION_ERROR = 6000,
	INSUFFICIENT_PRIVILEGES = 6001,
	RESOURCE_ACCESS_DENIED = 6002,

    // Parameter Errors (7000-7499)
    BAD_PARAMETER = 7000,

}

export class AppError extends Error {
	public errorCode = AppErrorCode.SERVER_ERROR;

	constructor(message: string) {
		super();
		this.name = 'AppError';
		this.message = message;
	}

}

export class AppHttpError extends AppError {
	public statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.name = 'AppHttpError';
		this.statusCode = statusCode;
	}
}

export class AppHealthCheckError extends AppHttpError {
	constructor(message: string) {
		super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
		this.name = 'AppHealthCheckError';
		this.errorCode = AppErrorCode.HEALTH_CHECK_ERROR;
	}
}

const defaultBadRequestMessage = `The request has invalid parameters.`
export class AppBadRequestError extends AppHttpError {
	constructor(message = defaultBadRequestMessage) {
		super(message, HttpStatusCode.BAD_REQUEST);
		this.name = 'AppBadRequestError';
		this.errorCode = AppErrorCode.BAD_REQUEST_ERROR;
	}
}

export class AppServerError extends AppHttpError {
	constructor(message: string) {
		super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
		this.name = 'AppServerError';
		this.errorCode = AppErrorCode.SERVER_ERROR;
	}
}

export class AppDatabaseError extends AppHttpError {
	constructor(message: string) {
		super(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
		this.name = 'AppDatabaseError';
		this.errorCode = AppErrorCode.DATABASE_ERROR;
	}
}

export class AppAuthenticationError extends AppHttpError {
	constructor(message: string) {
		super(message, HttpStatusCode.UNAUTHORIZED);
		this.name = 'AppAuthenticationError';
		this.errorCode = AppErrorCode.AUTHENTICATION_ERROR;
	}
}

export class AppPermissionError extends AppHttpError {
	constructor(message: string) {
		super(message, HttpStatusCode.UNAUTHORIZED);
		this.name = 'AppPermissionError';
		this.errorCode = AppErrorCode.PERMISSION_ERROR;
	}
}

export class AppApiKeyError extends AppHttpError {
	constructor(message: string) {
		super(message, HttpStatusCode.UNAUTHORIZED);
		this.name = 'AppApiKeyError';
		this.errorCode = AppErrorCode.API_KEY;
	}
}
