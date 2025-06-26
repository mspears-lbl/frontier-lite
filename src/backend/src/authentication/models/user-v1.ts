// function userLevelV1ToRole(userLevel: UserLevelV1): UserRole {
// 	switch (userLevel) {
// 		case UserLevelV1.Admin:
// 			return UserRole.PowerUser;
// 		case UserLevelV1.RegularUser:
// 			return UserRole.Default
// 		case UserLevelV1.Guest:
// 			return UserRole.Default;
// 		default:
// 			throw new Error(`Unknown user level: ${userLevel}`);
// 	}

import { UserStatus } from "../../../../common/models/app-user";

// }

enum UserStatusV1 {
	Registered=1,
	Active=2,
	Deactivated=3,
	PasswordReset=4
}

export function isUserStatusV1(value: any): value is UserStatusV1 {
	return value in UserStatusV1;
}

/**
 * Transforms the given UserStatus from the V1 database into the V2 database.
 */
export function toUserStatusV2(status: UserStatusV1): UserStatus {
	switch (status) {
		case UserStatusV1.Registered:
			return UserStatus.PasswordReset;
		case UserStatusV1.Active:
			return UserStatus.Ok;
		case UserStatusV1.Deactivated:
		return UserStatus.Disabled;
		case UserStatusV1.PasswordReset:
			return UserStatus.PasswordReset;
		default:
			throw new Error(`Unknown user status (${status})`);
	}
}

/** The shape of a User from V1 database. */
export interface UserV1Data {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	organization: string | null | undefined;
	validated: boolean | null | undefined;
	status: UserStatusV1;
	timestamp: number | null | undefined;
}

/** Determines if the given object looks like a UserV1. */
export function isUserV1(data: any): data is UserV1Data {
	return (
		data
		&& typeof data.id === 'number'
		&& typeof data.firstName === 'string'
		&& typeof data.lastName === 'string'
		&& typeof data.email === 'string'
		&& typeof data.password === 'string'
		&& (typeof data.organization === 'string' || data.organization == null)
		&& (typeof data.validated === 'boolean' || data.validated == null)
		&& isUserStatusV1(data.status)
		&& (typeof data.timestamp === 'number' || data.timestamp == null)
	) ? true : false;
}
