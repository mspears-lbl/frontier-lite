import { MailParams } from '../../post-office'

const path = 'account-request';
const host = process.env.HTTP_HOST_ADMIN;
if (!host) {
	throw new Error('HTTP_HOST environment variable is not set');
}
const url = `${host}/${path}`;

export function buildNewRegistrationAdminMessage(): MailParams {
	return {
		from: 'resource-planning-admin@emp-tools.lbl.gov',
		to: 'resource-planning-admin@emp-tools.lbl.gov',
		subject: 'New RPP Registration Information',
		message: `
			<p>Great news RPP Team:</p>
			<p>A new request for an RPP account has been received.</p>
			<p>Click the link to view the info:</p>
			<p><a href="${url}">${url}</a></p>
		`
	};
}
