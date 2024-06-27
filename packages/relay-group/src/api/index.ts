// add methods to add relayers to group, remove, pause, resume, etc.
import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  RelayerApiKey,
  DeleteRelayerApiKeyResponse,
  CreateKeyParams,
  RelayerGroupResponse,
  CreateRelayerGroupRequest,
  UpdateRelayerGroupRequest,
} from '../models';

export class RelayGroupClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async get(id: string): Promise<RelayerGroupResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/relayer-groups/${id}`);
    });
  }

  public async list(): Promise<RelayerGroupResponse> {
    return this.apiCall(async (api) => {
      return await api.get('/relayer-groups');
    });
  }

  public async create(relayerGroup: CreateRelayerGroupRequest): Promise<RelayerGroupResponse> {
    return this.apiCall(async (api) => {
      return await api.post('/relayer-groups', relayerGroup);
    });
  }

  public async update(id: string, relayerUpdateParams: UpdateRelayerGroupRequest): Promise<RelayerGroupResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`/relayer-groups/${id}`, relayerUpdateParams);
    });
  }

  public async createKey(id: string, createKeyParams?: CreateKeyParams): Promise<RelayerApiKey> {
    return this.apiCall(async (api) => {
      return await api.post(`/relayer-groups/${id}/keys`, createKeyParams);
    });
  }

  public async listKeys(id: string): Promise<RelayerApiKey[]> {
    return this.apiCall(async (api) => {
      return await api.get(`/relayer-groups/${id}/keys`);
    });
  }

  public async deleteKey(id: string, keyId: string): Promise<DeleteRelayerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return await api.delete(`/relayer-groups/${id}/keys/${keyId}`);
    });
  }
}
