// import { AppAuthenticationError, AppServerError } from "../../../../common/models/errors";
// import { insertUserRequestV1Query } from "../../admin/queries/user/insert-user-request-v1";
// // import { transferV1V2UserLseLinkQuery } from "../../app/queries/user-lse-link-v1/transfer-v1-v2";
// import { createLogger } from "../../logging";
// import { IDRecord } from "../../models/id-record";
// import { getUserV1ByEmailQuery } from "../queries/user-v1/by-email";
// import { AppUserAuth } from "./app-user-auth";
// import { AppUserRequestV1, UserV1Record, isUserV1Record, toAppUserRequestV1 } from "./user-v1";
// import crypto from 'crypto';

// const logger = createLogger(module);

// /** Transfers a V1 user account into the auth.user (V2) table */
// export class UserV1Transfer {
// 	private email: string;
// 	private password: string;
// 	private shouldValidatePassword: boolean;

// 	constructor(
// 		email: string,
// 		password: string,
// 		shouldValidatePassword = true

// 	) {
// 		this.email = email;
// 		this.password = password;
// 		this.shouldValidatePassword = shouldValidatePassword;
// 	}

// 	/** Determines if the given email has a record in the V1 user table */
// 	public static async hasV1Account(email: string): Promise<boolean> {
// 		try {
// 			// retrieving a non-existent user will throw an error
// 			await getUserV1ByEmailQuery.run(email);
// 			return true;
// 		} catch (error: any) {
// 			return false;
// 		}
// 	}

// 	public static async run(
// 		email: string,
// 		password: string,
// 		shouldValidatePassword = true
// 	): Promise<AppUserAuth> {
// 		const transfer = new UserV1Transfer(email, password, shouldValidatePassword);
// 		return await transfer.run();
// 	}

// 	private async run(): Promise<AppUserAuth> {
// 		const user = await this.getUserV1Record();
// 		this.validateUserV1Record(user);
// 		if (this.shouldValidatePassword) {
// 			this.validatePassword(user);
// 		}
// 		const userRequest = toAppUserRequestV1(user, this.password);
// 		const userV2 = await this.writeUser(userRequest);
// 		// await this.transferV1LseLinks(user, userV2);
// 		return userV2;
// 	}

// 	/** Get the user record from the V1 table. */
// 	private async getUserV1Record(): Promise<UserV1Record> {
// 		try {
// 			return await getUserV1ByEmailQuery.run(this.email);
// 		} catch (error: any) {
// 			logger.error(`getUserV1Record: unable to retrieve v1 user ${this.email}`);
// 			throw error;
// 		}

// 	}

// 	private validateUserV1Record(user: UserV1Record): void {
// 		if (!isUserV1Record(user)) {
// 			throw new AppServerError('validateUserV1Record: error validating user record');
// 		}
// 	}

// 	/** Validates the password for the V1 user, using the same hash method as V1  */
// 	private validatePassword(user: UserV1Record): void {
// 		try {
// 			const hash = crypto.createHash('md5')
// 				.update(this.password)
// 				.digest('hex');
// 			if (user.password !== hash) {
// 				throw new AppAuthenticationError('v1 password mismatch');
// 			}
// 		} catch (error: any) {
// 			logger.error(`validatePassword: error validating v1 password`);
// 			throw error;
// 		}

// 	}

// 	/** Writes the V1 user to the V2 user table */
// 	private async writeUser(user: AppUserRequestV1): Promise<AppUserAuth> {
// 		try {
// 			logger.debug(`writeUser: writing user ${user.email}`);
// 			return await insertUserRequestV1Query.run(user);
// 		} catch (error: any) {
// 			logger.error(`writeUser: unable to write user ${user.email}`);
// 			throw error;
// 		}
// 	}

// 	/** Transfer the User-LSE links from the V1 to V2 tables */
// 	// private async transferV1LseLinks(userV1: UserV1Record, user: AppUserAuth): Promise<IDRecord[] | null> {
// 	// 	try {
// 	// 		logger.debug(`transferV1LseLinks: user ${user.email}`);
// 	// 		const params = {
// 	// 			userId: user.id,
// 	// 			userIdV1: userV1.id
// 	// 		}
// 	// 		return await transferV1V2UserLseLinkQuery.run(params);
// 	// 	} catch (error: any) {
// 	// 		logger.error(`writeUser: unable to write user ${user.email}`);
// 	// 		throw error;
// 	// 	}
// 	// }
// }
