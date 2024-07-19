import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  RelayerGetResponse,
  CreateRelayerRequest,
  RelayerListResponse,
  UpdateRelayerPoliciesRequest,
  UpdateRelayerRequest,
  RelayerApiKey,
  DeleteRelayerApiKeyResponse,
  CreateKeyParams,
} from '../models';

export class RelayClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async get(id: string): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/relayers/${id}`);
    });
  }

  public async list(): Promise<RelayerListResponse> {
    return this.apiCall(async (api) => {
      return await api.get('/relayers/summary');
    });
  }

  public async create(relayer: CreateRelayerRequest): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return await api.post('/relayers', relayer);
    });
  }

  public async update(id: string, relayerUpdateParams: UpdateRelayerRequest): Promise<RelayerGetResponse> {
    const currentRelayer = await this.get(id);

    if (relayerUpdateParams.policies) {
      const relayerPolicies = {
        ...currentRelayer.policies,
        ...relayerUpdateParams.policies,
      };
      const updatedRelayer = await this.updatePolicies(id, relayerPolicies);
      // if policies are the only update, return
      if (Object.keys(relayerUpdateParams).length === 1) return updatedRelayer;
    }

    return this.apiCall(async (api) => {
      return await api.put(`/relayers`, {
        ...currentRelayer,
        ...relayerUpdateParams,
      });
    });
  }

  private async updatePolicies(id: string, relayerPolicies: UpdateRelayerPoliciesRequest): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`/relayers/${id}`, relayerPolicies);
    });
  }

  public async createKey(id: string, createKeyParams?: CreateKeyParams): Promise<RelayerApiKey> {
    return this.apiCall(async (api) => {
      return await api.post(`/relayers/${id}/keys`, createKeyParams);
    });
  }

  public async listKeys(id: string): Promise<RelayerApiKey[]> {
    return this.apiCall(async (api) => {
      return await api.get(`/relayers/${id}/keys`);
    });
  }

  public async deleteKey(id: string, keyId: string): Promise<DeleteRelayerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return await api.delete(`/relayers/${id}/keys/${keyId}`);
    });
  }
}
