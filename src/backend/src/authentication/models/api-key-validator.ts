import { insertOrUpdateApiKeyQuery } from "../queries/api-key/insert-or-update";
import { AppUserAuth } from "./app-user-auth";
import { v4 } from 'uuid';
import { ApiKeyInfo, ApiKeyInfoCreated, ApiKeyInfoWithHash, ApiKeyType } from '../../../../common/models/api-key';
import { getApiKeyQuery } from "../queries/api-key/get-api-key";
import { QueryParams } from '../queries/api-key/get-api-key';

export class ApiKeyValidator {
	
	private constructor(
		private user: AppUserAuth,
		private apiKey: string,
		private keyType: ApiKeyType
	) {

	}
	
	/** Build and write an API key to the database for API use for an authenticated user in the browser */
	public static async isValidApplicationKey(user: AppUserAuth, apiKey: string): Promise<ApiKeyInfoCreated> {
		const keyManager = new ApiKeyValidator(user, apiKey, ApiKeyType.Application);
		const result = await keyManager.isValidKey();
		return result;
	}
	
	/** Build and write an API key to the database for API use. */
	public static async isValidApiKey(user: AppUserAuth, apiKey: string): Promise<ApiKeyInfoCreated> {
		const keyManager = new ApiKeyValidator(user, apiKey, ApiKeyType.Api);
		const result = await keyManager.isValidKey();
		return result;
	}

	private async isValidKey(): Promise<ApiKeyInfoCreated> {
		const apiKey = this.getApiKey();
		const result = await this.writeApiKey(apiKey);
		return {...result, apiKey};
	}

	/** Generate a new API key  */
	private async getApiKey(): Promise<ApiKeyInfoWithHash | undefined> {
		const params: QueryParams = {
			userId: this.user.id,
			apiKeyType: this.keyType
		}
		return await getApiKeyQuery.run(params);
	}
}
