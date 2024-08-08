import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  TriggerCodeInspectorAnalysisRunRequest,
  TriggerCodeInspectorAnalysisRunResponse,
} from '../models/trigger-analysis';

export class CodeInspectorClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async triggerAnalysisRun(
    triggerCodeInspectorAnalysisRequest: TriggerCodeInspectorAnalysisRunRequest,
  ): Promise<TriggerCodeInspectorAnalysisRunResponse> {
    console.log('SENDING REQUEST EVENTUALY', triggerCodeInspectorAnalysisRequest);

    return { message: '' };
  }
}
