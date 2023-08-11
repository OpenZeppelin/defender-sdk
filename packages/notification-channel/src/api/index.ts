import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
  GetNotificationRequest,
  UpdateNotificationRequest,
  NotificationSummary as NotificationResponse,
  NotificationType,
} from '../models/notification';

const PATH = '/notifications';

export class NotificationChannelClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    // TODO: update to /monitor when available
    return process.env.DEFENDER_API_URL || 'https://platform-api.openzeppelin.com/sentinel/';
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

  public async delete(type: NotificationType, id: string): Promise<string> {
    return this.apiCall(async (api) => {
      return await api.delete(`${PATH}/${type}/${id}`);
    });
  }

  public async get(type: NotificationType, id: string): Promise<NotificationResponse> {
    return this.apiCall(async (api) => {
      return await api.get(`${PATH}/${type}/${id}`);
    });
  }

  public async update(
    type: NotificationType,
    id: string,
    notification: UpdateNotificationRequest,
  ): Promise<NotificationResponse> {
    return this.apiCall(async (api) => {
      return await api.put(`${PATH}/${type}/${id}`, notification);
    });
  }
}
