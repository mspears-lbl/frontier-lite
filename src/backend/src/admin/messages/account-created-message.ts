import { AppUserAuth } from '../../authentication/models/app-user-auth';
import { MailParams } from '../../post-office'

interface Params {
	firstName: string;
	email: string;
}

if (!process.env.HTTP_HOST) {
	throw new Error('Missing required environment variable: HTTP_HOST');
}
const url = `${process.env.HTTP_HOST}/password-reset`

export function buildAccountCreatedMessage(
	params: Params
): MailParams {
	return {
		from: 'ice-support@emp-tools.lbl.gov',
		to: params.email,
		subject: 'ICE Calculator Account Created',
		message: `
			<p>Hi ${params.firstName},</p>
			<p>Your ICE Calculator account has been created.</p>
			<p>Click the link below to begin using your account:</p>
			<p><a href="${url}">${url}</a></p>
		`
	};
}
