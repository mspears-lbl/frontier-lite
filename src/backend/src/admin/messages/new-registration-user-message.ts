import { MailParams } from '../../post-office'


export function buildNewRegistrationUserMessage(
	name: string,
	email: string
): MailParams {
	return {
		from: 'resource-planning-admin@emp-tools.lbl.gov',
		to: email,
		subject: 'Resource Planning Portal Account Registration Complete',
		message: `
			<p>Hi ${name},</p>
			<p>Your Resource Planning Portal registration has been submitted.
			Your request will be reviewed, and you will receive an email once your account has
			been created.</p>
			<p>Thank you</p>
			<p>The RPP Team</p>
		`
	};
}
