import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import { AccountUsageResponse } from '../models/account';

const PATH = '/account';

export class AccountClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID ?? 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID ?? '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL ?? 'https://defender-api.openzeppelin.com/v2/';
  }

  public async getUsage(params?: { date?: string | Date; quotas: string[] }): Promise<AccountUsageResponse> {
    const searchParams = new URLSearchParams({
      ...(params?.quotas && { quotas: params.quotas.join(',') }),
      ...(params?.date && { date: new Date(params.date).toISOString() }),
    });

    return this.apiCall(async (api) => api.get(`${PATH}/usage?${searchParams.toString()}`));
  }
}
