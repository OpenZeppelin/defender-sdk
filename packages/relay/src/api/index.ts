import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  RelayerGetResponse,
  CreateRelayerRequest,
  RelayerListResponse,
  UpdateRelayerPoliciesRequest,
  UpdateRelayerRequest,
  RelayerApiKey,
  DeleteRelayerApiKeyResponse,
} from '../models';

export class RelayClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/relayer/';
  }

  public async get({ relayerId }: { relayerId: string }): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/relayers/${relayerId}`);
    });
  }

  public async list(): Promise<RelayerListResponse> {
    return this.apiCall(async (api) => {
      return await api.get('/relayers/summary');
    });
  }

  public async create({ relayer }: { relayer: CreateRelayerRequest }): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return await api.post('/relayers', relayer);
    });
  }

  public async update({
    relayerId,
    relayerUpdateParams,
  }: {
    relayerId: string;
    relayerUpdateParams: UpdateRelayerRequest;
  }): Promise<RelayerGetResponse> {
    const currentRelayer = await this.get({ relayerId });

    if (relayerUpdateParams.policies) {
      const relayerPolicies = {
        ...currentRelayer.policies,
        ...relayerUpdateParams.policies,
      };
      const updatedRelayer = await this.updatePolicies({ relayerId, relayerPolicies });
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

  private async updatePolicies({
    relayerId,
    relayerPolicies,
  }: {
    relayerId: string;
    relayerPolicies: UpdateRelayerPoliciesRequest;
  }): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`/relayers/${relayerId}`, relayerPolicies);
    });
  }

  public async createKey({
    relayerId,
    stackResourceId,
  }: {
    relayerId: string;
    stackResourceId?: string;
  }): Promise<RelayerApiKey> {
    return this.apiCall(async (api) => {
      return await api.post(`/relayers/${relayerId}/keys`, { stackResourceId });
    });
  }

  public async listKeys({ relayerId }: { relayerId: string }): Promise<RelayerApiKey[]> {
    return this.apiCall(async (api) => {
      return await api.get(`/relayers/${relayerId}/keys`);
    });
  }

  public async deleteKey({
    relayerId,
    keyId,
  }: {
    relayerId: string;
    keyId: string;
  }): Promise<DeleteRelayerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return await api.delete(`/relayers/${relayerId}/keys/${keyId}`);
    });
  }
}
