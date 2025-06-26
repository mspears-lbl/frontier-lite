import { AppUserData, isAppUserData } from '../../../../common/models/app-user';

export interface AppUserAuth extends AppUserData {
    id: number;
    passwordHash: string;
}

export function isAppUserAuth(value: any): value is AppUserAuth {
    return (
        value
        && typeof value.id === 'number'
        && typeof value.passwordHash === 'string'
        && isAppUserData(value)
    ) ? true : false;
}

/**
 * Transforms an AppUserAuth object to an AppUserData object.
 * @param user The user to transform.
 * @returns A new AppUserData object based on the given user.
 */
export function toAppUser(user: AppUserAuth): AppUserData {
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organization: user.organization,
        uuid: user.uuid,
        role: user.role,
        status: user.status,
        comments: user.comments,
        created: user.created,
        modified: user.modified
    };
}
