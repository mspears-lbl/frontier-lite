import { RegistrationInfo, isRegistrationInfo } from "../../../../common/models/registration";
import { getUserByEmailQuery } from "../queries/user/get/by-email";
import { cacheOptions, redisClient } from "../../cache";
import { sendMail } from "../../post-office";
import { buildAccountConfirmMessage } from "../../admin/messages/account-confirmation-message";
import { getRegistrationInfoByEmailQuery } from "../queries/registration/get-by-email";
import { UserAccountExistsError } from "../../../../common/models/errors/user-account-exists-error";
import { InvalidRegistrationCodeError } from "../../../../common/models/errors/invalid-registration-code-error";
import { CreateAccountRequest, CreateAccountResponse } from '../../../../common/models/account-request';
import { AppAccountCreator } from "./account-creator";
import { getShortCode } from '../../utils/short-code';


export class RegistrationConfirmor {
	constructor(
		private data: CreateAccountRequest
	) {
	}

	public static async runUserConfirmation(params: CreateAccountRequest): Promise<CreateAccountResponse> {
		const confirmor = new RegistrationConfirmor(params);
		return await confirmor.run();
	}

	/** Run the main account confirmation routine. */
	private async run(): Promise<CreateAccountResponse> {
		try {
			if (await this.hasExistingAccount()) {
				// account already exists
				throw new UserAccountExistsError();
			}
			else if (this.data.code) {
				// check registration code if it's there
				const valid = await this.hasValidRegistrationCode()
				if (!valid) {
					// invalid code
					throw new InvalidRegistrationCodeError();
				}
				// success
				const result = await this.createAccount();
				return {success: true, confirm: true};
			}
			else {
				// send a confirmation code
				await this.sendConfirmationCode();
				const result: CreateAccountResponse = {
					success: true,
					confirm: false
				}
				return result;
			}
		} catch (error: any) {
			console.log(`Unable to run the registration confirmor`);
			throw error;
		}
	}

	/** Determines if the given email is associated with a FRONTIER account. */
	public async hasExistingAccount(): Promise<boolean> {
		try {
			await getUserByEmailQuery.run(this.data.email);
			return true;
		} catch (error: any) {
			return false;
		}
	}

	/** Determines if the email address has already been submitted for account creation. */
	public async hasExistingRegistrationInfo(): Promise<boolean> {
		try {
			console.log('get existing reg info');
			const regInfo = await getRegistrationInfoByEmailQuery.run(this.data.email);
			console.log('done');
			console.log(regInfo);
			return regInfo ? true : false;
		} catch (error: any) {
			console.log(`Error checking for existing registration info for email ${this.data.email}`);
			throw error;
		}
	}


	/** Determines if the given registration info has a valid registration code. */
	public async hasValidRegistrationCode(): Promise<boolean> {
		try {
			return this.data.code
				? RegistrationCodeCache.hasMatchingCode(this.data.email, this.data.code)
				: false;
		} catch (error: any) {
			console.log(`Unable to determine if ${this.data.email} has a valid registration code`);
			throw error;
		}
	}

	private async sendConfirmationCode(): Promise<void> {
		try {
			const code = getShortCode();
			await RegistrationCodeCache.setRegistrationCode(this.data.email, code);
			// await RegistrationCache.setCacheData(this.data);
			await this.sendRegistrationCodeMessage(code);
		} catch (error: any) {
			console.log(`Unable to run the registration confirmor`);
			throw error;
		}
	}

	private async sendRegistrationCodeMessage(code: string): Promise<void> {
		try {
			const messageParams = buildAccountConfirmMessage(
				this.data.firstName,
				this.data.email,
				code
			);
			await sendMail(messageParams);
		} catch (error: any) {
			console.log(`Unable to send the registration confirmation code email.`);
			throw error;
		}
	}

	private async createAccount(): Promise<void> {
		try {
			await AppAccountCreator.run(this.data);
		} catch (error: any) {
			console.log(`An error occurred completing the registration for ${this.data.email}`);
			throw error;
		}
	}

	// private async completeRegistration(): Promise<CreateAccountResponse> {
	// 	try {
	// 		await insertRegistrationInfoQuery.run(this.data);
	// 		await this.sendRegistrationCompleteMessage();
	// 		const response: CreateAccountResponse = {
	// 			success: true,
	// 			confirm: true
	// 		}
	// 		return response;
	// 	} catch (error: any) {
	// 		console.log(`An error occurred completing the registration for ${this.data.email}`);
	// 		throw error;
	// 	}
	// }

	// /** Sends a message to the user and admin that the registration was completed. */
	// private async sendRegistrationCompleteMessage(): Promise<any> {
	// 	await this.sendRegistrationCompleteAdminMessage();
	// 	await this.sendRegistrationCompleteUserMessage();
	// }

	// /** Sends a message to the admin that the registration was completed.  */
	// private async sendRegistrationCompleteAdminMessage(): Promise<any> {
	// 	try {
	// 		const messageParams = buildNewRegistrationAdminMessage();
	// 		await sendMail(messageParams);
	// 	} catch (error: any) {
	// 		console.log(`An error occurred sending the admin registration email for ${this.data.email}`);
	// 		throw error;
	// 	}
	// }

	// /** Sends a message to the user that the registration was completed. */
	// private async sendRegistrationCompleteUserMessage(): Promise<any> {
	// 	try {
	// 		const messageParams = buildNewRegistrationUserMessage(
	// 			this.data.firstName,
	// 			this.data.email
	// 		);
	// 		await sendMail(messageParams);
	// 	} catch (error: any) {
	// 		console.log(`An error occurred sending the user registration email for ${this.data.email}`);
	// 		throw error;
	// 	}
	// }
}


export class RegistrationCodeCache {
	private static keyPrefix = 'create-account-code'

	private static getCacheKey(email: string): string {
		return `${RegistrationCodeCache.keyPrefix}:${email}`;
	}

	public static async setRegistrationCode(email: string, code: string): Promise<void> {
		try {
			const cacheKey = RegistrationCodeCache.getCacheKey(email);
			await redisClient.set(cacheKey, code, cacheOptions);
		} catch (error: any) {
			console.log(`Error setting the cache code for ${email}`);
			throw error;
		}
	}

	public static async hasMatchingCode(email: string, code: string): Promise<boolean> {
		try {
			const cacheKey = RegistrationCodeCache.getCacheKey(email);
			const storedCode = await redisClient.get(cacheKey);
			return storedCode === code ? true : false;
		} catch (error: any) {
			console.log(`Error checking the registration code for ${email}`);
			throw error;
		}
	}

	public static async deleteRegistrationCode(email: string): Promise<void> {
		try {
			const cacheKey = RegistrationCodeCache.getCacheKey(email);
			await redisClient.del(cacheKey);
		} catch (error: any) {
			console.log('Error deleting the cached registration info.');
			throw error;
		}
	}
}

export class RegistrationInfoCache {
	private static keyPrefix = 'create-account';

	private static getCacheKey(email: string): string {
		return `${RegistrationInfoCache.keyPrefix}:${email}`;
	}

	public static async getCachedRegistration(email: string): Promise<RegistrationInfo> {
		try {
			const cacheKey = RegistrationInfoCache.getCacheKey(email);
			const regString = await redisClient.get(cacheKey);
			if (!regString) {
				throw new Error(`Cached registration info for '${email}' not found.`);
			}
			const regItem = JSON.parse(regString);
			if (!isRegistrationInfo(regItem)) {
				throw new Error(`Cached registration info for '${email}' is invalid.`);
			}
			return regItem;

		} catch (error: any) {
			console.log('Error retrieving cached registration info.');
			throw error;
		}
	}

	public static async hasCachedRegistration(email: string): Promise<boolean> {
		try {
			const cacheKey = RegistrationInfoCache.getCacheKey(email);
			const regString = await redisClient.get(cacheKey);
			return regString ? true : false;
		} catch (error: any) {
			console.log('Error checking the registration info.');
			throw error;
		}
	}

	public static async setCacheData(params: RegistrationInfo): Promise<void> {
		try {
			const cacheKey = RegistrationInfoCache.getCacheKey(params.email);
			const regString = JSON.stringify(params);
			await redisClient.set(cacheKey, regString, cacheOptions);
		} catch (error: any) {
			console.log('Error setting the cached registration info.');
			throw error;
		}
	}

	public static async deleteCachedRegistration(email: string): Promise<void> {
		try {
			const cacheKey = RegistrationInfoCache.getCacheKey(email);
			await redisClient.del(cacheKey);
		} catch (error: any) {
			console.log('Error deleting the cached registration info.');
			throw error;
		}
	}
}
