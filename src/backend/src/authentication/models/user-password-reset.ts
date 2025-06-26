import { v4 } from "uuid";
import { createLogger } from "../../logging";
import { AppUserAuth } from "./app-user-auth";
import * as util from 'util';
import { CacheManager } from './cache-manager'
import * as jwt from 'jsonwebtoken';
import { MailParams, sendMail } from "../../post-office";
import { buildPasswordResetMessage } from '../messages/password-reset-message';
import { cacheOptions } from "../../cache";
import { hashPassword } from "./password-hash";
import { updateUserPasswordQuery } from "../queries/user/update/update-pw";
import { appHost } from "../../utils/app-host";
import { UserStatus } from "../../../../common/models/app-user";
import { PasswordResetFinalRequest } from '../../../../common/models/password-reset';
import { updateUserStatusQuery } from "../queries/user/update/update-account-status";
// import { isUserV1Record, UserV1Record } from "./user-v1";
import { AppPermissionError } from "../../../../common/models/errors";
// import { UserV1V2Loader } from "./user-v2-v1-loader";
import { isDisabledUser } from "./is-disabled-user";
// import { UserV1Transfer } from "./user-v1-transfer";
import { canAuthenticateGoogle } from "../../../../common/models/auth";
import { getUserByEmailQuery } from "../queries/user/get/by-email";
import { getShortCode } from '../../utils/short-code';

const logger = createLogger(module);

class PasswordResetCacheManager extends CacheManager {
	protected keyPrefix = 'pwReset'
	protected cacheOptions = cacheOptions;
}
const cacheManager = new PasswordResetCacheManager();

export interface ResetPasswordPayload {
	email: string;
	code: string;
}

function isResetPasswordPayload(value: any): value is ResetPasswordPayload {
	return typeof value?.email === 'string'
		&& typeof value.code === 'string'
		? true : false;
}

const signOptions: jwt.SignOptions = { expiresIn: 60 * 10 };
export function encryptResetPayload(payload: ResetPasswordPayload): string {
	return jwt.sign(payload, String(process.env.JWT_SECRET), signOptions);
}
function decryptPasswordResetPayload(encryptedPayload: string): ResetPasswordPayload{
	try {
		const payload = jwt.verify(encryptedPayload, String(process.env.JWT_SECRET));
		if (!isResetPasswordPayload(payload)) {
			throw new Error('Invalid payload');
		}
		return payload;
	} catch (error: any) {
		logger.error(`Error decrypting password reset code`);
		logger.error(util.inspect(error, {depth: null}));
		throw error;
	}
}

export function buildPasswordResetUrl(hashedPayload: string): string {
	return `${appHost}/reset-password?token=${hashedPayload}`;
}

interface PasswordResetResult {
	userExists: boolean;
	emailSent: boolean;
}

/**
 * Runs the initial portion of the password reset process:
 *  - load the record from the email address
 *  - generate the link and appropriate codes
 *  - write the codes for the user to the cache
 *  - send the link to the user via email
 */
export class UserPasswordResetInitial {

	constructor(
		private email: string,
		private trans?: any
	) {
	}

	public static async run(email: string): Promise<PasswordResetResult> {
		const userPasswordReset = new UserPasswordResetInitial(email);
		return await userPasswordReset.run();
	}


	private async run(): Promise<PasswordResetResult> {
		this.validateNotGoogle();
		const user = await this.getUserRecord();
		if (user) {
			this.validateDisabledUser(user);
			const payload = this.generatePasswordResetPayload(user.email);
			await this.cachePasswordResetInfo(payload);
			const message = await this.buildMessage(user, payload);
			this.sendMessage(message);
			return {
				userExists: true,
				emailSent: true
			};
		}
		else {
			return {
				userExists: false,
				emailSent: false
			};
		}
	}

	/**
	 * Retrieve the user record associated with the given email, if it exists.
	 * @returns A V1 or V2 user record if it exists, otherwise undefined.
	 */
	private async getUserRecord(): Promise<AppUserAuth | null | undefined> {
		try {
			// return await UserV1V2Loader.run(this.email);
			return await getUserByEmailQuery.run(this.email);
		} catch (error: any) {
			console.log(`error retrieving v1 record for ${this.email}`);
			logger.error(util.inspect(error, {depth: null}));
			return undefined;
		}
	}


    /**
     * Make sure a user's account has not been disabled.
     */
    private validateDisabledUser(user: AppUserAuth): void {
		if (!isDisabledUser(user)) {
			throw new AppPermissionError('User account is disabled');
		}
    }

	/**
	 * Make sure the user has an email address that requires a password, ie a non-lbl.gov email (google)
	 */
	private validateNotGoogle(): void {
		if (canAuthenticateGoogle(this.email)) {
			throw new Error('Unable to reset password for Google accounts');
		}
	}

	private generatePasswordResetPayload(email: string): ResetPasswordPayload {
		const code = getShortCode();
		return {
			email,
			code
		}
	}

	private async cachePasswordResetInfo(payload: ResetPasswordPayload): Promise<void> {
		try {
			cacheManager.setCacheCode(payload.email, payload.code);
		} catch (error: any) {
			logger.error(`Error caching password reset code for ${this.email} in UserPasswordReset`);
		}
	}

	private async sendMessage(params: MailParams): Promise<void> {
		try {
			await sendMail(params);
		} catch (error: any) {
			logger.error(`Error sending the reset message for ${this.email} in UserPasswordResetInitial`);
			logger.error(util.inspect(error, {depth: null}));
			throw error;
			
		}
	}

	private async buildMessage(user: AppUserAuth, payload: ResetPasswordPayload): Promise<MailParams> {
		try {
			return buildPasswordResetMessage(user, payload.code);
		} catch (error: any) {
			logger.error(`Error sending the reset message for ${this.email} in UserPasswordReset`);
			logger.error(util.inspect(error, {depth: null}));
			throw error;
		}
	}

}

export class UserPasswordResetFinal {

	constructor(
		private params: PasswordResetFinalRequest
	) {
	}


	public static async run(params: PasswordResetFinalRequest): Promise<void> {
		const userPasswordReset = new UserPasswordResetFinal(params);
		await userPasswordReset.run();
	}

	private async run(): Promise<void> {
		await this.validateCacheCode();
		const user = await this.getUserRecord(this.params.email);
		console.log(this.params);
		this.validateDisabledUser(user);
		// if (isUserV1Record(user)) {
        //     const v2User = await UserV1Transfer.run(payload.email, this.params.password, false);
		// 	console.log('successfully updated a v1 user password')
		// 	console.log(v2User);
		// }
		// else {
			await this.updatePassword(user);
			await this.updateStatus(user);
		// }
	}

	/**
	 * Make sure the password-reset code given by the user matches the one in the cache.
	 */
	private async validateCacheCode(): Promise<void> {
		try {
			const hasMatchingCode = await cacheManager.hasMatchingCode(this.params.email, this.params.token);
			if (!hasMatchingCode) {
				throw new Error('Invalid code');
			}
		} catch (error) {
			logger.error(`Invalid password-reset code`)
			throw error;
		}
	}

	private async getUserRecord(email: string): Promise<AppUserAuth> {
		try {
			// const user = await getUserByEmailQuery.run(email);
			const user = await getUserByEmailQuery.run(email);
			logger.debug('User record for password reset');
			logger.debug(util.inspect(user, {depth: null}));
			return user;
		} catch (error: any) {
			logger.error(`Error retrieving user record for ${email} in UserPasswordReset`);
			// logger.error(util.inspect(error, {depth: null}));
			throw error;
		}
	}

    private validateDisabledUser(user: AppUserAuth): void {
		if (!isDisabledUser(user)) {
			throw new AppPermissionError('User account is disabled');
		}
    }

	private async updatePassword(user: AppUserAuth): Promise<void> {
		try {
			const hashedPassword = await hashPassword(this.params.password);
			logger.debug(`set new password for ${user.email} - ${this.params.password} - ${hashedPassword}`);
			await updateUserPasswordQuery.run(user.uuid, hashedPassword);
		} catch (error) {
			logger.error(`error setting the password for ${user.email}`)
			// logger.error(util.inspect(error, {depth: null}));
			throw error;
		}
	}

	private async updateStatus(user: AppUserAuth): Promise<void> {
		try {
			logger.debug(`update user status for ${user.email} to ${UserStatus.Ok}`);
			await updateUserStatusQuery.run({uuid: user.uuid, status: UserStatus.Ok});
		} catch (error) {
			logger.error(`error setting the status for ${user.email}`);
			// logger.error(util.inspect(error, {depth: null}));
			throw error;
		}
	}
}
