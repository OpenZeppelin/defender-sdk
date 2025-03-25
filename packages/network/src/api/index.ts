import { BaseApiClient, Network } from '@openzeppelin/defender-sdk-base-client';

import {
  TenantNetworkCreateRequest,
  TenantNetworkResponse,
  TenantNetworkUpdateRequest,
  ListNetworkRequestOptions,
  PrivateNetworkCreateRequest,
  PrivateNetworkResponse,
  PrivateNetworkUpdateRequest,
  NetworkDefinition,
} from '../models/networks';

const PATH = '/networks';

export class NetworkClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/';
  }

  public async listSupportedNetworks(
    params: ListNetworkRequestOptions & { includeDefinition: true },
  ): Promise<NetworkDefinition[]>;
  public async listSupportedNetworks(
    params?: ListNetworkRequestOptions & { includeDefinition?: false },
  ): Promise<Network[]>;

  public async listSupportedNetworks(
    params: ListNetworkRequestOptions = { includeDefinition: false },
  ): Promise<Network[] | NetworkDefinition[]> {
    const queryParams: string[] = [];

    if (params.networkType) {
      const networkTypes = Array.isArray(params.networkType) ? params.networkType : [params.networkType];
      queryParams.push(`type=${encodeURIComponent(networkTypes.join(','))}`);
    }

    if (params.includeDefinition) {
      queryParams.push('includeDefinition=true');
    }

    return this.apiCall(async (api) => {
      return await api.get(`${PATH}${queryParams.length ? `?${queryParams.join('&')}` : ''}`);
    });
  }

  public async listForkedNetworks(): Promise<TenantNetworkResponse[]> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/fork`);
    });
  }

  public async createForkedNetwork(
    network: Omit<TenantNetworkCreateRequest, 'networkType'>,
  ): Promise<TenantNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`${PATH}/fork`, { ...network, networkType: 'fork' });
    });
  }

  public async deleteForkedNetwork(id: string): Promise<string> {
    return this.apiCall(async (api) => {
      return await api.delete(`${PATH}/fork/${id}`);
    });
  }

  public async getForkedNetwork(id: string): Promise<TenantNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/fork/${id}`);
    });
  }

  public async updateForkedNetwork(
    id: string,
    network: Omit<TenantNetworkUpdateRequest, 'tenantNetworkId'>,
  ): Promise<TenantNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`${PATH}/fork/${id}`, { ...network, tenantNetworkId: id });
    });
  }

  public async listPrivateNetworks(): Promise<PrivateNetworkResponse[]> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/private`);
    });
  }

  public async createPrivateNetwork(
    network: Omit<PrivateNetworkCreateRequest, 'networkType'>,
  ): Promise<PrivateNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`${PATH}/private`, { ...network, networkType: 'private' });
    });
  }

  public async deletePrivateNetwork(id: string): Promise<string> {
    return this.apiCall(async (api) => {
      return await api.delete(`${PATH}/private/${id}`);
    });
  }

  public async getPrivateNetwork(id: string): Promise<PrivateNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/private/${id}`);
    });
  }

  public async updatePrivateNetwork(
    id: string,
    network: Omit<PrivateNetworkUpdateRequest, 'tenantNetworkId'>,
  ): Promise<PrivateNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`${PATH}/private/${id}`, { ...network, tenantNetworkId: id });
    });
  }
}
