import { BaseApiClient } from "@openzeppelin/platform-sdk-base-client";

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
}  