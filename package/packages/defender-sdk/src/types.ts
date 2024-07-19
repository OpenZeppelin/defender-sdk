import { AuthConfig, RetryConfig } from '@openzeppelin/defender-sdk-base-client';
import https from 'https';

export type Newable<T> = { new (...args: any[]): T };

export type ClientParams = {
  apiKey: string;
  apiSecret: string;
  httpsAgent?: https.Agent;
  retryConfig?: RetryConfig;
  authConfig: AuthConfig;
};
