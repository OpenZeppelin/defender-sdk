import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  CreateNotificationRequest,
  UpdateNotificationRequest,
  NotificationSummary as NotificationResponse,
  NotificationType,
} from '../models/notification';
import crypto from 'crypto';
import { getMillisSince } from './utils';
import { SignatureVerificationParams } from '../models/webhook';

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

  public verifySignature(params: SignatureVerificationParams): { valid: boolean; error?: string } {
    if (!params.body) throw new Error('Body payload is missing');
    if (!params.secret) throw new Error('Secret is missing');
    if (!params.signature) throw new Error('Signature is missing');
    if (!params.timestamp) throw new Error('Timestamp is missing');

    const TEN_MINUTES_IN_MS = 1000 * 60 * 10;
    const validityInMillis = params.validityInMs || TEN_MINUTES_IN_MS;

    // Check if the timestamp is valid
    const createdAt = new Date(params.timestamp);
    const millisSince = getMillisSince(createdAt);
    const isExpired = millisSince >= validityInMillis || millisSince <= 0;
    if (isExpired) return { valid: false, error: 'Timestamp is expired' };

    const bodyObject = typeof params.body === 'string' ? JSON.parse(params.body) : params.body;
    try {
      // Verify the signature
      const payloadToVerify = JSON.stringify({ ...bodyObject, timestamp: params.timestamp });
      const generatedSignature = crypto.createHmac('sha256', params.secret).update(payloadToVerify).digest('hex');
      const signatureValid = generatedSignature === params.signature;
      const error = !signatureValid ? 'Signature is invalid' : undefined;

      return { valid: signatureValid, error };
    } catch (e) {
      return { valid: false, error: 'Error verifying signature' };
    }
  }
}
