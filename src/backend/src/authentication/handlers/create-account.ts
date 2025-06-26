// import { Request, Response } from 'express';
// import { createLogger } from '../../logging/index';
// import * as util from 'util';
// import { redisClient } from '../../cache';
// import { CreateAccountRequestLocal, isCreateAccountRequestLocal } from '../../../../common/models/res-account';
// import { SetOptions } from 'redis';
// import { AppAccountCreator } from '../models/account-creator';
// import { getUserByEmailQuery } from '../queries/user/get/by-email';
// import { canSendMail, sendMail } from '../../post-office';
// import { buildAccountCreatedMessage } from '../messages/account-created-message';

// const logger = createLogger(module);

// export class CreateAccountHandler {
//     constructor(
//         private request: Request,
//         private response: Response
//     ) {
//     }

//     public static async handleRequest(
//         request: Request,
//         response: Response
//     ): Promise<any> {
//         const handler = new CreateAccountHandler(request, response);
//         return handler.run();
//     }

//     public async run(): Promise<any> {
//         try {
//             logger.info('CreateAccountHandler');
//             logger.debug(util.inspect(this.request.body));
//             const params = this.getParams();
//             console.log(params);
//             const accountExists = await this.accountExists(params.email);
//             if (accountExists) {
//                 this.response.status(400).send('An account with the given email already exists');
//                 return;
//             }
//             // console.log('redis client?');
//             // console.log(redisClient);
//             // if (isCreateAccountRequestGoogle(params)) {
//             //     const options: SetOptions = {
//             //         EX: 120
//             //     }
//             //     const existing = await redisClient.get(`create-account:${params.email}`);
//             //     console.log(`existing = ${existing ? true : false}`)
//             //     const stringParams = JSON.stringify(params);
//             //     const result = await redisClient.set(`create-account:${params.email}`, stringParams, options);
//             //     console.log('redis write result = ')
//             //     console.log(result);
//             // }
//             if (isCreateAccountRequestLocal(params)) {
//                 await AppAccountCreator.fromAccountRequestLocal(params);
//                 const user = await getUserByEmailQuery.run(params.email);
// 				// if (canSendMail()) {
// 				// 	console.log('build an email message and send...');
// 				// 	const message = buildAccountCreatedMessage(user);
// 				// 	console.log('sending account email...');
// 				// 	await sendMail(message);
// 				// 	console.log('done');
// 				// }
//             }
//             this.response.status(200).send();
//             // this.response.header('Access-Control-Allow-Origin', '*');
//             // this.response.redirect('/api/login/google');
//         } catch (error) {
//             logger.error('Error in CreateAccountHandler');
//             logger.debug(util.inspect(error))
//             this.response.status(500).send();
//         }
//     }

//     private getParams(): CreateAccountRequestLocal {
//         const params = this.request.body;
//         if (isCreateAccountRequestLocal(params)) {
//             return params;
//         }
//         else {
//             throw new Error('Invalid params');
//         }
//     }

//     /** Determine if an account with the given email address exists. */
//     private async accountExists(email: string): Promise<boolean> {
//         try {
//             await getUserByEmailQuery.run(email);
//             return true;
//         } catch (error: any) {
//             return false;
//         }
//     }
    
// }
