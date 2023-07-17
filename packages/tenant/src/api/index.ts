import { BaseApiClient, Network } from '@openzeppelin/platform-sdk-base-client';
import { TenantResponse } from '../models/tenant';

const PATH = '/tenants';

export class TenantClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.PLATFORM_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.PLATFORM_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    // TODO: update to platform-api.* url (and /admin) when available
    return process.env.PLATFORM_API_URL || 'https://defender-api.openzeppelin.com/admin/';
  }
  public async listNetworks(type?: 'prod' | 'test'): Promise<Network[]> {
    return this.apiCall(async (api) => {
      const tenant = (await api.get(type ? `${PATH}/networks?type=${type}` : `${PATH}/networks`)) as TenantResponse;
      return tenant.networks || [];
    });
  }
}
