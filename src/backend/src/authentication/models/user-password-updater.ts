import { AppUserAuth } from './app-user-auth';
import { getUserByEmailQuery } from '../queries/user/get/by-email/index';
import { createLogger } from '../../logging/index';
import * as util from 'util';
import { hashPassword } from './password-hash';
import { updateUserPasswordQuery } from '../queries/user/update/update-pw/index';

const logger = createLogger(module);

export class UserPasswordUpdater {

	private constructor(
		private email: string,
		private password: string
	) {
	}

	public static async run(email: string, password: string): Promise<void> {
		const updater = new UserPasswordUpdater(email, password);
		return await updater.run();
	}

	private async run(): Promise<void> {
		const user = await this.getUserFromEmail();
		await this.setUserPasswordForUser(user.uuid)
	}

	private async getUserFromEmail(): Promise<AppUserAuth> {
		try {
			return await getUserByEmailQuery.run(this.email);
		} catch (error: any) {
			logger.debug('Error updating user password')
			logger.debug(util.inspect(error));
			throw error;
		}
	}

	private async setUserPasswordForUser(userUUID: string): Promise<void> {
		try {
			const hashedPassword = await hashPassword(this.password);
			logger.debug(`set new password for ${userUUID} - ${this.password} - ${hashedPassword}`);
			await updateUserPasswordQuery.run(userUUID, hashedPassword);
		} catch (error: any) {
			logger.debug('Error setting new password')
			logger.debug(util.inspect(error));
			throw error;
		}
	}

}
