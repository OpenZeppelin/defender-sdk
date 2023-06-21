import { BaseApiClient } from "@openzeppelin/platform-sdk-base-client";
import { 
	CreateNotificationRequest, 
	DeleteNotificationRequest, 
	GetNotificationRequest, 
	UpdateNotificationRequest,
	NotificationSummary as NotificationResponse,
} from "../models/notification";

const PATH = '/notifications';

export class NotificationChannelClient extends BaseApiClient {
    protected getPoolId(): string {
      return process.env.PLATFORM_POOL_ID || 'us-west-2_94f3puJWv';
    }
  
    protected getPoolClientId(): string {
      return process.env.PLATFORM_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
    }
  
    protected getApiUrl(): string {
      // TODO: update to platform-api.* url (and /sentinel) when available
      return process.env.PLATFORM_API_URL || 'https://defender-api.openzeppelin.com/sentinel/';
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
	
		public async delete(notification: DeleteNotificationRequest): Promise<string> {
			return this.apiCall(async (api) => {
				return await api.delete(`${PATH}/${notification.type}/${notification.notificationId}`);
			});
		}
	
		public async get(notification: GetNotificationRequest): Promise<NotificationResponse> {
			return this.apiCall(async (api) => {
				return await api.get(`${PATH}/${notification.type}/${notification.notificationId}`);
			});
		}
	
		public async update(notification: UpdateNotificationRequest): Promise<NotificationResponse> {
			return this.apiCall(async (api) => {
				return await api.put(`${PATH}/${notification.type}/${notification.notificationId}`, notification);
			});
		}
}