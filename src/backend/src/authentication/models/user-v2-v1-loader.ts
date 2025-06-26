// import { AppAuthenticationError } from "../../../../common/models/errors";
// import { createLogger } from "../../logging";
// import { getUserByEmailQuery } from "../queries/user/get/by-email";
// import { AppUserAuth } from "./app-user-auth";
// import * as util from 'util';
// import { UserV1Record } from "./user-v1";
// import { getUserV1ByEmailQuery } from "../queries/user-v1/by-email";

// const logger = createLogger(module);

// /** Loads the User V1/V2 records */
// export class UserV1V2Loader {
// 	constructor(
// 		private email: string,
// 	) {
// 	}

// 	public static async run(email: string): Promise<AppUserAuth | UserV1Record> {
// 		return await new UserV1V2Loader(email).run();
// 	}

// 	private async run(): Promise<AppUserAuth | UserV1Record> {
//         try {
//             return await this.loadUserRecord();
//         } catch (error: any) {
//             return await this.transferUserRecord();
//         }
// 	}

//     private async loadUserRecord(): Promise<AppUserAuth> {
//         try {
//             logger.debug(`load the user record for ${this.email}`);
//             const userData = await getUserByEmailQuery.run(this.email);
//             return userData;
//         } catch (error) {
//             logger.error('Error in loadUserRecord');
//             logger.debug(util.inspect(error, {depth: null}));
//             throw new AppAuthenticationError('User not found');
//         }
//     }

//     private async transferUserRecord(): Promise<UserV1Record> {
//         try {
//             logger.debug(`load the v1 user record for ${this.email}`);
// 			return await getUserV1ByEmailQuery.run(this.email);
//         } catch (error) {
//             logger.error('Error in transferUserRecord');
//             throw error;
//         } 

//     }

// }