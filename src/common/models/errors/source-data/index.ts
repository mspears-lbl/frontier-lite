import { AppErrorCode, AppHttpError } from ".";
import { HttpStatusCode } from "../http-status-codes";

export class DuplicateSpreadsheetDownloadRequestError extends AppHttpError{
	constructor() {
		super(
            `You have already submitted a request for a spreadsheet download.  Please wait for the current request to be processed.`,
            HttpStatusCode.BAD_REQUEST
        );
		this.name = 'DuplicateSpreadsheetDownloadRequest';
		this.errorCode = AppErrorCode.SPREADSHEET_DOWNLOAD_REQUEST_DUPLICATE;
	}
}

export class SpreadsheetDownloadCodeError extends AppHttpError{
	constructor() {
		super(
            `The confirmation code you submitted is invalid.`,
            HttpStatusCode.BAD_REQUEST
        );
		this.name = 'SpreadsheetDownloadCodeError';
		this.errorCode = AppErrorCode.SPREADSHEET_DOWNLOAD_CODE_ERROR;
	}
}

export class SpreadsheetDownloadRequestEmailError extends AppHttpError{
	constructor(email: string) {
		super(
            `There was an error sending the email to ${email}.`,
            HttpStatusCode.INTERNAL_SERVER_ERROR
        );
		this.name = 'SpreadsheetDownloadRequestEmailError';
		this.errorCode = AppErrorCode.SPREADSHEET_DOWNLOAD_REQUEST_EMAIL;
	}
}
