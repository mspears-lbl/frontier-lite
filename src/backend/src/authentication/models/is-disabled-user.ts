import { AppUserData, isAppUserData, UserStatus } from "../../../../common/models/app-user";
import { AppServerError } from "../../../../common/models/errors";

/**
 * Determines if the given user has an account that's disabled.
 * The user record can be from either the V1 or V2 versions.
 * @param user The user record to check if disabled.
 * @returns True if the user is disabled, false otherwise.
 */
export function isDisabledUser(user: AppUserData): boolean {
	if (isAppUserData(user)) {
		if (user.status === UserStatus.Disabled) {
			return false;
		}
	}
	else {
		throw new AppServerError('Invalid user type');
	}
	return true;
}
