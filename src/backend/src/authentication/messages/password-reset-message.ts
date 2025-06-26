import { MailParams } from '../../post-office'
import { AppUserAuth } from '../models/app-user-auth';

export function buildPasswordResetMessage(
	user: AppUserAuth,
	code: string
): MailParams {
	return {
		from: 'ice-support@emp-tools.lbl.gov',
		to: user.email,
		subject: 'ICE Calculator Password Reset',
		message: `
<p>
Hi ${user.firstName},
</p>

<p>
You recently requested a password reset for your ICE Calculator account.
</p>

<p>
Please provide the following code to continue:
</p>

<p>
<strong>${code}</strong>
</p>

<p style="font-weight: bold;">
This code is valid for 60 minutes.
</p>

<p>
If you didn't request a password reset, please ignore this email.
</p>

<p>
Thanks,
</p>
<p>
The ICE Calculator Team
</p>
		`
	};
}
