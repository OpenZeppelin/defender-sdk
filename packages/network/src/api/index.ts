import { BaseApiClient, Network } from '@openzeppelin/defender-sdk-base-client';

import {
  TenantNetworkCreateRequest,
  TenantNetworkResponse,
  TenantNetworkUpdateRequest,
  ListNetworkRequestOptions,
  PrivateNetworkCreateRequest,
  PrivateNetworkResponse,
  PrivateNetworkUpdateRequest,
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

  public getApiKey(): string {
    return this.getKey();
  }

  public getAccessToken(): Promise<string> {
    return this.getToken();
  }

  public async listSupportedNetworks(params?: ListNetworkRequestOptions): Promise<Network[]> {
    return this.apiCall(async (api) => {
      return await api.get(params && params.networkType ? `${PATH}?type=${params.networkType}` : `${PATH}`);
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
