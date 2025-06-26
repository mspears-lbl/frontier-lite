import { AppUserData } from '../../../../common/models/app-user';
import { getUserByEmailQuery } from '../queries/user/get/by-email';
import { insertUserQuery } from '../queries/user/insert-user';
import { AppUserAuth } from './app-user-auth';
import { db } from '../../db';
import { IDRecord } from '../../models/id-record';
import { CreateUserAccountRequest } from '../../../../common/models/registration';
import { buildAccountCreatedMessage } from '../../admin/messages/account-created-message';
import { sendMail } from '../../post-office';
import { updateRegistrationStatusQuery } from '../queries/registration/update';
import { RegistrationStatus } from '../../../../common/models/registration-status';
import { CreateAccountRequest } from '../../../../common/models/account-request';

export class AppAccountCreator {

	protected constructor(
		protected data: CreateAccountRequest
	) {
	}

	public static async run(data: CreateAccountRequest): Promise<any> {
		const builder = new AppAccountCreator(data);
		return await builder.run();
	}

	protected async run(): Promise<any> {
		// await this.validateEmail();
		await this.createUser();
		// await this.updateAccountRequestStatus();
		await this.sendUserEmail();
	}

	/** Ensure that the email address doesn't already exist in the system */
	// private async validateEmail(): Promise<void> {
	// 	const accountExists = await this.accountExists();
	// 	if (accountExists) {
	// 		throw new Error(`Account for ${this.data.email} already exists`);
	// 	}
	// }

	// private async accountExists(): Promise<boolean> {
	// 	let user: AppUserAuth | undefined;
	// 	try {
	// 		user = await getUserByEmailQuery.run(this.data.email);
	// 	} catch (error) {
	// 	}
	// 	return user ? true : false;
	// }

	/**
	 * Create the user account
	 * @returns An object containing the new user's ID
	 */
	private async createUser(): Promise<IDRecord> {
		try {
			return await insertUserQuery.run(this.data);
		} catch (error: any) {
			console.log(error);
			console.log(`Unable to create the user account.`);
			throw error;
		}
	}

	/**
	 * Update the AccountRequest status to Approved
	 */
	// private async updateAccountRequestStatus(): Promise<void> {
	// 	try {
	// 		await updateRegistrationStatusQuery.run({
	// 			id: this.data.registrationId,
	// 			registrationStatus: RegistrationStatus.Approved
	// 		})
	// 	} catch (error: any) {
	// 		console.log(`Unable to update the AccountRequest status to Approved.`);
	// 		throw error; }
	// }

	/**
	 * Send the user an email about the new account
	 */
	private async sendUserEmail(): Promise<void> {
		try {
			const messageParams = buildAccountCreatedMessage({
				firstName: this.data.firstName,
				email: this.data.email,
			});
			await sendMail(messageParams);
		} catch (error: any) {
			console.log(`Unable to send the registration confirmation code email.`);
			throw error;
		}
	}

}
