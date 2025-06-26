import { MailParams } from '../../post-office'

export function buildAccountConfirmMessage(
	name: string,
	email: string,
	code: string
): MailParams {
	return {
		from: 'ice-support@emp-tools.lbl.gov',
		to: email,
		subject: 'Confirm Your Email for the ICE Calculator',
		message: `
			<p>Hi ${name},</p>
			<p>Please confirm your email address to continue signing up for the the ICE Calculator.</p>
			<p>Enter the following code to complete your registration:</p>
			<strong>${code}</strong>
			<p>Thank you</p>
			<p>The ICE Calculator Team</p>
		`
	};
}
