import { BaseApiClient, Network } from '@openzeppelin/defender-sdk-base-client';

import {
  ForkedNetworkCreateRequest,
  ForkedNetworkResponse,
  ForkedNetworkUpdateRequest,
  ListNetworkRequestOptions,
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
    // TODO: update to /monitor when available
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async create(network: ForkedNetworkCreateRequest): Promise<ForkedNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`${PATH}/forks`, network);
    });
  }

  public async list(): Promise<ForkedNetworkResponse[]> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/forks`);
    });
  }

  public async listSupportedNetworks(params?: ListNetworkRequestOptions): Promise<Network[]> {
    return this.apiCall(async (api) => {
      return await api.get(params && params.networkType ? `${PATH}?type=${params.networkType}` : `${PATH}`);
    });
  }

  public async delete(id: string): Promise<string> {
    return this.apiCall(async (api) => {
      return await api.delete(`${PATH}/forks/${id}`);
    });
  }

  public async get(id: string): Promise<ForkedNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/forks/${id}`);
    });
  }

  public async update(
    id: string,
    network: Omit<ForkedNetworkUpdateRequest, 'forkedNetworkId'>,
  ): Promise<ForkedNetworkResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`${PATH}/forks/${id}`, { ...network, forkedNetworkId: id });
    });
  }
}
