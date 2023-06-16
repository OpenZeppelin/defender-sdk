import { createHash } from 'crypto';
import { BaseApiClient } from '@openzeppelin/defender-base-client';
import {
  CreateActionRequest,
  UpdateActionRequest,
  GetSecretsResponse,
  SaveSecretsRequest,
} from './models/action';
import {
  ActionRunBase,
  ActionRunListResponse,
  ActionRunResponse,
  ActionRunStatus,
} from './models/action-run.res';
import { ActionDeleteResponse, ActionListResponse, ActionResponse } from './models/response';
import { zipFolder, zipSources } from './zip';

type SourceFiles = {
  'index.js': string;
  [name: string]: string;
};

export class ActionClient extends BaseApiClient {
  protected getPoolId(): string {
    // migrate env variable name to => DEFENDER_ACTION_POOL_ID
    return process.env.DEFENDER_AUTOTASK_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    // migrate env variable name to => DEFENDER_ACTION_POOL_CLIENT_ID
    return process.env.DEFENDER_AUTOTASK_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    // TODO: update to platform-api.* url (and /action) when available + env variable name
    return process.env.DEFENDER_AUTOTASK_API_URL || 'https://defender-api.openzeppelin.com/autotask/';
  }

  public async list(): Promise<ActionListResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/autotasks`);
    });
  }

  public async get({ actionId } : { actionId: string }): Promise<ActionResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/autotasks/${actionId}`);
    });
  }

  public async delete({ actionId } : { actionId: string }): Promise<ActionDeleteResponse> {
    return this.apiCall(async (api) => {
      return await api.delete(`/autotasks/${actionId}`);
    });
  }

  public async create(action: CreateActionRequest): Promise<ActionResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`/autotasks`, action);
    });
  }

  public async update(action: UpdateActionRequest): Promise<ActionResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`/autotasks/`, action);
    });
  }

  public getEncodedZippedCodeFromBuffer({ buffer }: { buffer: Buffer }): string {
    return buffer.toString('base64');
  }

  public async getEncodedZippedCodeFromSources(sources: SourceFiles): Promise<string> {
    return await zipSources(sources);
  }

  public async getEncodedZippedCodeFromFolder({ path }: { path: string }): Promise<string> {
    return await zipFolder(path);
  }

  public async updateCodeFromZip({ actionId , buffer }: { actionId: string, buffer: Buffer }): Promise<void> {
    const encodedZippedCode = this.getEncodedZippedCodeFromBuffer({ buffer });
    return this.updateCode({ actionId, encodedZippedCode });
  }

  public async updateCodeFromSources({ actionId, sources }: { actionId: string, sources: SourceFiles }): Promise<void> {
    const encodedZippedCode = await this.getEncodedZippedCodeFromSources(sources);
    return this.updateCode({ actionId, encodedZippedCode });
  }

  public async updateCodeFromFolder({ actionId, path } : { actionId: string, path: string }): Promise<void> {
    const encodedZippedCode = await this.getEncodedZippedCodeFromFolder({ path });
    return this.updateCode({ actionId, encodedZippedCode });
  }

  public async listActionRuns({
    actionId,
    next,
    status
  }: {
    actionId: string,
    next?: string,
    status?: ActionRunStatus | undefined,
  }): Promise<ActionRunListResponse> {
    if (next && !status && (next === 'success' || next === 'error' || next === 'pending' || next === 'throttle')) {
      status = next as ActionRunStatus;
      next = undefined;
    }
    return this.apiCall(async (api) => {
      return api.get(`/autotasks/${actionId}/runs`, { params: { next, status } });
    });
  }

  public async getActionRun({ actionRunId }: { actionRunId: string }): Promise<ActionRunResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`/autotasks/runs/${actionRunId}`);
    });
  }

  public async runAction({ actionId, data }: { actionId: string, data: { [key: string]: any } }): Promise<ActionRunBase> {
    return this.apiCall(async (api) => {
      return await api.post(`/autotasks/${actionId}/runs/manual`, data);
    });
  }

  public getCodeDigest({ encodedZippedCode }: { encodedZippedCode: string }): string {
    const binary = Buffer.from(encodedZippedCode, 'base64');
    return createHash('SHA256').update(binary).end().digest('base64');
  }

  private async updateCode({ actionId, encodedZippedCode }: { actionId: string, encodedZippedCode: string }): Promise<void> {
    return this.apiCall(async (api) => {
      return await api.put(`/autotasks/${actionId}/code`, { encodedZippedCode });
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
}
