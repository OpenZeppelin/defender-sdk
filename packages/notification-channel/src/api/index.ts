import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationSummary as NotificationResponse,
  NotificationType,
} from '../models/notification';
import crypto from 'crypto';
import { getMillisSince } from './utils';

const PATH = '/notifications';

export class NotificationChannelClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async create(notification: CreateNotificationRequest): Promise<NotificationResponse> {
    return this.apiCall(async (api) => {
      return await api.post(`${PATH}/${notification.type}`, notification);
    });
  }

  public async list(): Promise<NotificationResponse[]> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}`);
    });
  }

  public async delete(id: string, type: NotificationType): Promise<string> {
    return this.apiCall(async (api) => {
      return await api.delete(`${PATH}/${type}/${id}`);
    });
  }

  public async get(id: string, type: NotificationType): Promise<NotificationResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/${type}/${id}`);
    });
  }

  public async update(
    id: string,
    type: NotificationType,
    notification: UpdateNotificationRequest,
  ): Promise<NotificationResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`${PATH}/${type}/${id}`, notification);
    });
  }

  public verifySignature(params: {
    signature: string;
    secret: string;
    timestamp: string;
    validityInMs?: number;
  }): boolean {
    if (!params.secret) throw new Error('Secret is missing');
    if (!params.signature) throw new Error('Signature is missing');
    if (!params.timestamp) throw new Error('Timestamp is missing');

    try {
      const TEN_MINUTES_IN_MS = 1000 * 60 * 10;
      const validityInMillis = params.validityInMs || TEN_MINUTES_IN_MS;
      const createdAt = new Date(params.timestamp);

      const millisSince = getMillisSince(createdAt);
      const isRecent = millisSince <= validityInMillis && millisSince >= 0;

      const generatedSignature = crypto.createHmac('sha256', params.secret).update(params.timestamp).digest('hex');
      const signatureValid = generatedSignature === params.signature;

      return signatureValid && isRecent;
    } catch (e) {
      return false;
    }
  }
}
