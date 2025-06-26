import { MailParams } from '../../post-office'
import { AppUserAuth } from "../models/app-user-auth";

export function buildAccountCreatedMessage(
	user: AppUserAuth
): MailParams {
	return {
		from: 'res-support@lbl.gov',
		to: user.email,
		subject: 'Power Reliability Event Simulation Tool Account Created',
		message: `
			<p>Hi ${user.firstName},</p>
			<p>Your PRESTO account has been created.</p>
			<p>You can now log in to your account using the following link:</p>
			<p><a href="${process.env.FRONTEND_URL}/login">Login</a></p>
		`
	};
}
