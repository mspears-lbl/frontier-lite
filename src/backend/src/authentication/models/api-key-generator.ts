import { QueryParams, insertOrUpdateApiKeyQuery } from "../queries/api-key/insert-or-update";
import { AppUserAuth } from "./app-user-auth";
import { v4 } from 'uuid';
import { ApiKeyInfo, ApiKeyInfoCreated, ApiKeyType } from '../../../../common/models/api-key';
import { hashPassword } from "./password-hash";

export class ApiKeyGenerator {
	
	private constructor(
		private user: AppUserAuth,
		private keyType: ApiKeyType
	) {

	}
	
	/** Build and write an API key to the database for API use for an authenticated user in the browser */
	public static async generateApplicationKey(user: AppUserAuth): Promise<ApiKeyInfoCreated> {
		const keyManager = new ApiKeyGenerator(user, ApiKeyType.Application);
		const result = await keyManager.generateApiKey();
		return result;
	}
	
	/** Build and write an API key to the database for API use. */
	public static async generateApiKey(user: AppUserAuth): Promise<ApiKeyInfoCreated> {
		const keyManager = new ApiKeyGenerator(user, ApiKeyType.Api);
		const result = await keyManager.generateApiKey();
		return result;
	}

	private async generateApiKey(): Promise<ApiKeyInfoCreated> {
		const apiKey = this.getApiKey();
		const result = await this.writeApiKey(apiKey);
		return {...result, apiKey};
	}

	/** Generate a new API key  */
	private getApiKey(): string {
		return v4();
	}
	/** Write the API key to the database, and return the result. */
	private async writeApiKey(apiKey: string): Promise<ApiKeyInfo> {
		const params = this.getQueryParams(apiKey);
		return await insertOrUpdateApiKeyQuery.run(params);
	}

	/** Build the query parameters for the insert or update query */
	private getQueryParams(apiKey: string): QueryParams {
		return {
			userId: this.user.id,
			apiKey: apiKey,
			apiKeyType: this.keyType
		}
	}

}
