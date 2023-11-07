import { createHash } from 'crypto';
import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  CreateActionRequest,
  UpdateActionRequest,
  GetSecretsResponse,
  SaveSecretsRequest,
  EnvironmentVariables,
} from './models/action';
import {
  ActionRunBase,
  ActionRunListParams,
  ActionRunListResponse,
  ActionRunResponse,
  ActionRunStatus,
} from './models/action-run.res';
import { ActionDeleteResponse, ActionListResponse, ActionResponse } from './models/response';
import { zipFolder, zipSources } from './zip';
import { tailLogsFor, validateId, validatePath } from './utils';

type SourceFiles = {
  'index.js': string;
  [name: string]: string;
};

export class ActionClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    // TODO: update to /action when available
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async list(): Promise<ActionListResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/actions`);
    });
  }

  public async get(id: string): Promise<ActionResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/actions/${id}`);
    });
  }

  public async delete(id: string): Promise<ActionDeleteResponse> {
    return this.apiCall(async (api) => {
      return await api.delete(`/actions/${id}`);
    });
  }

  public async create(action: CreateActionRequest): Promise<ActionResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`/actions`, action);
    });
  }

  public async update(action: UpdateActionRequest): Promise<ActionResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`/actions/`, action);
    });
  }

  public getEncodedZippedCodeFromBuffer({ buffer }: { buffer: Buffer }): string {
    return buffer.toString('base64');
  }

  public async getEncodedZippedCodeFromSources(sources: SourceFiles): Promise<string> {
    return await zipSources(sources);
  }

  public async getEncodedZippedCodeFromFolder(path: string): Promise<string> {
    return await zipFolder(path);
  }

  public async updateCodeFromZip(id: string, { buffer }: { buffer: Buffer }): Promise<void> {
    const encodedZippedCode = this.getEncodedZippedCodeFromBuffer({ buffer });
    return this.updateCode(id, { encodedZippedCode });
  }

  public async updateCodeFromSources(id: string, { sources }: { sources: SourceFiles }): Promise<void> {
    const encodedZippedCode = await this.getEncodedZippedCodeFromSources(sources);
    return this.updateCode(id, { encodedZippedCode });
  }

  public async updateCodeFromFolder(id: string, { path }: { path: string }): Promise<void> {
    const encodedZippedCode = await this.getEncodedZippedCodeFromFolder(path);
    return this.updateCode(id, { encodedZippedCode });
  }

  public async listActionRuns(id: string, params: ActionRunListParams): Promise<ActionRunListResponse> {
    // TODO: move to backend.
    const { next, status } = params;
    if (next && !status && (next === 'success' || next === 'error' || next === 'pending' || next === 'throttle')) {
      params = {
        status: next as ActionRunStatus,
        next: undefined,
      };
    }
    return this.apiCall(async (api) => {
      return api.get(`/actions/${id}/runs`, { params });
    });
  }

  public async getActionRun(id: string): Promise<ActionRunResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/actions/runs/${id}`);
    });
  }

  public async runAction(id: string, data: { [key: string]: any }): Promise<ActionRunBase> {
    return this.apiCall(async (api) => {
      return await api.post(`/actions/${id}/runs/manual`, data);
    });
  }

  public getCodeDigest({ encodedZippedCode }: { encodedZippedCode: string }): string {
    const binary = Buffer.from(encodedZippedCode, 'base64');
    const hash = createHash('SHA256').update(binary);
    return hash.digest('base64');
  }

  private async updateCode(id: string, { encodedZippedCode }: { encodedZippedCode: string }): Promise<void> {
    return this.apiCall(async (api) => {
      return await api.put(`/actions/${id}/code`, { encodedZippedCode });
    });
  }

  public async updateEnvironmentVariables(
    id: string,
    { variables }: { variables: EnvironmentVariables },
  ): Promise<EnvironmentVariables> {
    return this.apiCall(async (api) => {
      return await api.put(`/actions/${id}/environment`, { variables });
    });
  }

  public async getEnvironmentVariables(id: string): Promise<EnvironmentVariables> {
    return this.apiCall(async (api) => {
      return await api.get(`/actions/${id}/environment`);
    });
  }

  public async createSecrets(data: SaveSecretsRequest): Promise<GetSecretsResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`/secrets`, data);
    });
  }

  public async listSecrets(): Promise<GetSecretsResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/secrets`);
    });
  }

  public tailLogsFor(actionId: string): Promise<void> {
    return tailLogsFor(this, actionId);
  }

  public validateId(id: string): void {
    validateId(id);
  }

  public validatePath(path: string): void {
    validatePath(path);
  }
}
