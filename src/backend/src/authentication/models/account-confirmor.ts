import { nanoid } from 'nanoid'
import { AppUserAuth } from "./app-user-auth";
import { buildAccountConfirmMessage } from "../messages/account-confirmation-message";
import { MailParams, sendMail } from '../../post-office/index';
import { AccountStatus, AppUser } from "../../../../common/models/app-user";
import { AccountConfirmationRequest, isAccountConfirmationRequest } from '../../../../common/models/auth';
import { updateAccountStatusQuery } from '../queries/user/update/account-status';
import { QueryParams } from '../queries/user/update/account-status';
import { redisClient } from '../../cache';
import { SetOptions } from 'redis';

export function accountNeedsConfirmation(user: AppUserAuth): boolean {
	return user.accountStatus === AccountStatus.NeedsConfirmation
		? true : false;
}

export async function getConfirmationCode(user: AppUserAuth): Promise<string> {
	const code = nanoid();
	const options: SetOptions = {
		EX: 120
	}
	await redisClient.set(`${user.id}:confirmation_code`, code, options);
	return code;
}

export async function sendConfirmationEmail(
	user: AppUserAuth,
	confirmationCode: string
): Promise<void> {
	const message = buildAccountConfirmMessage(user, confirmationCode);
	await sendMail(message);
}

export class AccountConfirmor {
	private constructor(
		private user: AppUserAuth,
		private confirmRequest: AccountConfirmationRequest
	) {
	}

	public static async confirmAccount(
		user: AppUserAuth,
		confirmRequest: AccountConfirmationRequest
	): Promise<void> {
		const obj = new AccountConfirmor(user, confirmRequest);
		await obj.run();
	}

	private async run(): Promise<void> {
		this.validateParams();
		const params = this.buildQueryParams();
		await updateAccountStatusQuery.run(params);
	}

	private async validateParams(): Promise<void> {
		if (!accountNeedsConfirmation(this.user)) {
			throw new Error('Account is already confirmed');
		}
		else if (!isAccountConfirmationRequest(this.confirmRequest)) {
			throw new Error('Invalid confirmation request');
		}
		else if (!(await this.hasValidCode())) {
			throw new Error('Invalid confirmation code');
		}
		
	}

	private async hasValidCode(): Promise<boolean> {
		const code = await redisClient.get(`${this.user.id}:confirmation_code`);
		return code === this.confirmRequest.code;
	}

	private buildQueryParams(): QueryParams {
		return {
			userId: this.user.id,
			accountStatus: AccountStatus.Confirmed,
		}
	}
	

}
