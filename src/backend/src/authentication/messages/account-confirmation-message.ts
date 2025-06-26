import { MailParams } from '../../post-office'
import { AppUserAuth } from "../models/app-user-auth";

export function buildAccountConfirmMessage(
	user: AppUserAuth,
	code: string
): MailParams {
	return {
		from: 'res-support@lbl.gov',
		to: user.email,
		subject: 'Confirm Your Power Reliability Event Simulation Tool Account',
		message: `
			<p>Hi ${user.firstName},</p>
			<p>You have successfully created a Power Reliability Event Simulation Tool (PRESTO) account.</p>
			<p>You must confirm your account with the following code to start using the PRESTO:</p>
			<p>${code}</p>
		`
	};
}
