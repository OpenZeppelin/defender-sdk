import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import { AccountUsageResponse, ApiKeyCapability, ApiKeyCapabilityV2, toApiKeysCapabilityV2 } from '../models/account';

const PATH = '/account';
const API_KEY_PATH = '/api-keys';

export class AccountClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID ?? 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID ?? '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL ?? 'https://defender-api.openzeppelin.com/';
  }

  public getApiKey(): string {
    return this.getKey();
  }

  public getAccessToken(): Promise<string> {
    return this.getToken();
  }

  public async getUsage(params?: { date?: string | Date; quotas: string[] }): Promise<AccountUsageResponse> {
    const searchParams = new URLSearchParams({
      ...(params?.quotas && { quotas: params.quotas.join(',') }),
      ...(params?.date && { date: new Date(params.date).toISOString() }),
    });

    return this.apiCall(async (api) => api.get(`${PATH}/usage?${searchParams.toString()}`));
  }

  public async listApiKeyCapabilities(): Promise<ApiKeyCapabilityV2[]> {
    const res = await this.apiCall<ApiKeyCapability[]>(async (api) =>
      api.get(`${API_KEY_PATH}/${this.apiKey}/capabilities`),
    );
    return res.map(toApiKeysCapabilityV2);
  }
}
