import { AppUserRequest, AppUserRequestRegistered } from '../../../../common/models/app-user-request';
import * as util from 'util';
import { insertUserQuery } from '../queries/user/insert/index';
import { createLogger } from '../../logging';
import { AppUserAuth, toAppUser } from '../../authentication/models/app-user-auth';
import { v4 } from 'uuid';
import { cacheOptions, redisClient } from '../../cache';
import { db } from '../../db';
import { AppUser, AppUserData, CreateUserResponse } from '../../../../common/models/app-user';
import { buildAccountCreatedMessage } from '../messages/account-created-message';
import { sendMail } from '../../post-office';
// import { updateRegistrationStatusQuery } from '../../frontier/queries/registration/update';
// import { RegistrationStatus, UpdateRegistrationStatusRequest } from '../../../../common/models/registration';
// import { insertRegisteredUserQuery } from '../../frontier/queries/registration-user/insert';
// import { insertServiceTerritoryUserQuery } from '../../frontier/queries/service-territory-user/insert';

const logger = createLogger(module);

export class UserCreator {

	constructor(
		private data: AppUserRequestRegistered
	) {
	}
	
	public static async run(user: AppUserRequestRegistered): Promise<CreateUserResponse> {
		const creator = new UserCreator(user);
		return await creator.run();
	}

	private async run(): Promise<CreateUserResponse> {
		// run the query in a transaction
		return await db.tx(async (trans) => {
			const user = await this.createAccount(trans);
			// await this.setUtilityAccess(user, trans);
			// await this.setRegistrationStatusApproved(trans);
			// await this.setRegistrationUser(user, trans);
			const passwordResetCode = this.createRegistrationCacheCode();
			// await this.setRegistrationCacheCode(passwordResetCode);
			// await this.sendUserMessage(user, passwordResetCode);
			return {user: toAppUser(user), passwordResetCode};
		});
	}
	
	/** Create the user account. */
	private async createAccount(trans: any): Promise<AppUserAuth> {
		try {
			const params: any = {...this.data};
			logger.debug(`Create the user...`);
			logger.debug(util.inspect(params, {depth: null}));
			return await insertUserQuery.run(params, trans);
		} catch (error: any) {
			logger.error(`Error in UserCreator.run, could not create user.`);
			logger.error(util.inspect(error, {depth: null}));
			throw new Error(`Unable to create user ${this.data.email}`);
		}
	}

	// private async setUtilityAccess(user: AppUserAuth, trans: any): Promise<void> {
	// 	try {
	// 		for (let utility of this.data.utilities) {
	// 			const params = {
	// 				userId: user.id,
	// 				serviceTerritoryId: utility
	// 			}
	// 			console.log(params);
	// 			await insertServiceTerritoryUserQuery.run(params, trans);
	// 			console.log('done')
	// 		}
	// 	} catch (error: any) {
	// 		logger.error(`Error setting utility access for ${this.data.emailAddress}`);
	// 		throw error;
	// 	}
	// }

	/** Change the status of the registration record to reflect the user was created */
	// private async setRegistrationStatusApproved(trans: any): Promise<void> {
	// 	try {
	// 		console.log(`reg data = `)
	// 		console.log(this.data)
	// 		if (!this.data.registrationId) {
	// 			throw new Error('Expected RegistrationInfo to have a valid registration id');
	// 		}
	// 		const params: UpdateRegistrationStatusRequest = {
	// 			id: this.data.registrationId,
	// 			status: RegistrationStatus.Approved
	// 		}
	// 		updateRegistrationStatusQuery.run(params, trans);
	// 	} catch (error: any) {
	// 		logger.error(`Error setting the registration status for  ${this.data.emailAddress}`);
	// 		throw error;
	// 	}
	// }

	// private async setRegistrationUser(user: AppUserAuth, trans: any): Promise<void> {
	// 	try {
	// 		const params = {
	// 			registrationId: this.data.registrationId,
	// 			userId: user.uuid
	// 		}
	// 		insertRegisteredUserQuery.run(params, trans);
	// 	} catch (error: any) {
	// 		logger.error(`Error setting the registered user for ${this.data.emailAddress}`);
	// 		throw error;
	// 	}
	// }

	private createRegistrationCacheCode(): string {
		try {
			return v4();
		} catch (error: any) {
			logger.error(`Error in UserCreator, unable to create RegistrationCacheCode.`);
			logger.error(util.inspect(error, {depth: null}));
			throw new Error(`Unable to create user ${this.data.email}`);
		}
	}

	// private async setRegistrationCacheCode(code: string): Promise<any> {
	// 	try {
	// 		logger.debug(`Set the registration cache code for ${this.data.emailAddress} to ${code}`);
	// 		await SetUserPasswordCache.setRegistrationCode(this.data.emailAddress, code);
	// 	} catch (error: any) {
	// 		logger.error(`Error in UserCreator, unable to setRegistrationCacheCode`);
	// 		logger.error(util.inspect(error, {depth: null}));
	// 		throw new Error(`Unable to create user ${this.data.emailAddress}`);
	// 	}

	// }

	// private async sendUserMessage(user: AppUserAuth, code: string): Promise<void> {
	// 	try {
	// 		const url = this.buildPasswordResetUrl(code);
	// 		const message = buildAccountCreatedMessage(user, url);
	// 		await sendMail(message);
	// 	} catch (error: any) {
	// 		logger.error(`Error in UserCreator.sendUserMessage, could not send message to user.`);
	// 		logger.error(util.inspect(error, {depth: null}));
	// 		throw new Error(`Unable to create user ${this.data.emailAddress}`);
	// 	}
	// }

	// private buildPasswordResetUrl(code: string): string {
	// 	return `${process.env.HTTP_HOST}/password-reset/${code}`;
	// }

}

/** Handles the setting of the cache for user password reset. */
export class SetUserPasswordCache {
	private static keyPrefix = 'set-pw'

	private static getCacheKey(email: string): string {
		return `${SetUserPasswordCache.keyPrefix}:${email}`;
	}

	public static async setRegistrationCode(email: string, code: string): Promise<void> {
		try {
			const cacheKey = SetUserPasswordCache.getCacheKey(email);
			console.log(`set cache ${cacheKey} to ${code}`)
			await redisClient.set(cacheKey, code, cacheOptions);
		} catch (error: any) {
			console.log(`Error setting the cache code for ${email}`);
			throw error;
		}
	}

	public static async hasMatchingCode(email: string, code: string): Promise<boolean> {
		try {
			const cacheKey = SetUserPasswordCache.getCacheKey(email);
			const storedCode = await redisClient.get(cacheKey);
			console.log(`stored code ${storedCode} for ${email}`);
			return storedCode === code ? true : false;
		} catch (error: any) {
			console.log(`Error checking the registration code for ${email}`);
			throw error;
		}
	}

	public static async deleteRegistrationCode(email: string): Promise<void> {
		try {
			const cacheKey = SetUserPasswordCache.getCacheKey(email);
			await redisClient.del(cacheKey);
		} catch (error: any) {
			console.log('Error deleting the cached registration info.');
			throw error;
		}
	}
}