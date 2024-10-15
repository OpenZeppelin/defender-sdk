import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import { CreateApprovalProcessRequest, CreateApprovalProcessResponse } from '../models/approval-process';

const PATH = '/approval-process';

export class ApprovalProcessClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID ?? 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID ?? '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL ?? 'https://defender-api.openzeppelin.com/v2/';
  }

  public async create(approvalProcess: CreateApprovalProcessRequest): Promise<CreateApprovalProcessResponse> {
    return this.apiCall(async (api) => {
      return await api.post(PATH, approvalProcess);
    });
  }

  public async list(): Promise<CreateApprovalProcessResponse[]> {
    return this.apiCall(async (api) => {
      return await api.get(PATH);
    });
  }
}
