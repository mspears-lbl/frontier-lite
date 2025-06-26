import { AppUserAuth } from '../../authentication/models/app-user-auth';
import { MailParams } from '../../post-office'

export function buildPasswordChangedMessage(
	user: AppUserAuth,
	url: string
): MailParams {
	return {
		from: 'frontier-admin@emp-tools.lbl.gov',
		to: user.email,
		subject: 'FRONTIER Account Password Changed',
		message: `
			<p>Hi ${user.firstName},</p>
			<p>The password for your FRONTIER account has been updated.</p>
			<p>
				You can login to <a href="${url}">${url}</a>,
				or contact frontier-admin@emp-tools.lbl.gov for any questions.
			</p>
		`
	};
}
