import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { AxiosError, AxiosInstance } from 'axios';

import https from 'https';

import { createAuthenticatedApi } from './api';
import { authenticate, refreshSession } from './auth';
import { sleep } from '../utils/time';

export type RetryConfig = {
  retries: number;
  retryDelay: (retryCount: number, error: AxiosError) => number;
  retryCondition?: (error: AxiosError) => boolean | Promise<boolean>;
};

type ApiFunction<TResponse> = (api: AxiosInstance) => Promise<TResponse>;
export abstract class BaseApiClient {
  private api: AxiosInstance | undefined;
  private apiKey: string;
  private session: CognitoUserSession | undefined;
  private apiSecret: string;
  private httpsAgent?: https.Agent;
  private retryConfig: RetryConfig;

  protected abstract getPoolId(): string;
  protected abstract getPoolClientId(): string;
  protected abstract getApiUrl(): string;

  public constructor(params: {
    apiKey: string;
    apiSecret: string;
    httpsAgent?: https.Agent;
    retryConfig?: Partial<RetryConfig>;
  }) {
    if (!params.apiKey) throw new Error(`API key is required`);
    if (!params.apiSecret) throw new Error(`API secret is required`);

    this.apiKey = params.apiKey;
    this.apiSecret = params.apiSecret;
    this.httpsAgent = params.httpsAgent;
    this.retryConfig = { retries: 3, retryDelay: exponentialDelay, ...params.retryConfig };
  }

  protected async init(): Promise<AxiosInstance> {
    if (!this.api) {
      const userPass = { Username: this.apiKey, Password: this.apiSecret };
      const poolData = { UserPoolId: this.getPoolId(), ClientId: this.getPoolClientId() };
      this.session = await authenticate(userPass, poolData);
      this.api = createAuthenticatedApi(userPass.Username, this.session, this.getApiUrl(), this.httpsAgent);
    }
    return this.api;
  }

  protected async refresh(overrides?: { headers: Record<string, string> }): Promise<AxiosInstance> {
    if (!this.session) {
      return this.init();
    }
    try {
      const userPass = { Username: this.apiKey, Password: this.apiSecret };
      const poolData = { UserPoolId: this.getPoolId(), ClientId: this.getPoolClientId() };
      this.session = await refreshSession(userPass, poolData, this.session);
      this.api = createAuthenticatedApi(
        userPass.Username,
        this.session,
        this.getApiUrl(),
        this.httpsAgent,
        overrides?.headers,
      );

      return this.api;
    } catch (e) {
      return this.init();
    }
  }

  private async withRetry<TResponse>(
    axiosInstance: AxiosInstance,
    apiFunction: ApiFunction<TResponse>,
    { retryCount, retryDelay }: { retryCount: number; retryDelay: number } = { retryCount: 0, retryDelay: 0 },
  ): Promise<TResponse> {
    try {
      await sleep(retryDelay);
      return await apiFunction(axiosInstance);
    } catch (error: any) {
      // this means ID token has expired so we'll recreate session and try again
      if (isAuthenticationError(error)) {
        this.api = undefined;

        const api = await this.refresh();
        return await this.withRetry(api, apiFunction, { retryCount, retryDelay });
      }

      const updatedRetryState = {
        retryCount: retryCount + 1,
        retryDelay: this.retryConfig.retryDelay(retryCount + 1, error),
      };

      if (updatedRetryState.retryCount > this.retryConfig.retries) throw error;

      if (isCloudFlareError(error)) {
        const apiWithUpgradeHeaders = await this.refresh({
          headers: {
            Connection: 'upgrade',
            Upgrade: 'HTTP/2.0',
          },
        });

        return await this.withRetry(apiWithUpgradeHeaders, apiFunction, updatedRetryState);
      }

      if (await (this.retryConfig?.retryCondition?.(error) ?? true))
        await this.withRetry(axiosInstance, apiFunction, updatedRetryState);

      throw error;
    }
  }

  // prettier-ignore
  protected async apiCall<TResponse>(apiFunction: ApiFunction<TResponse>): Promise<TResponse> {
    const api = await this.init();
    return this.withRetry(api, apiFunction)
  }
}

const isAuthenticationError = (axiosError: AxiosError): boolean =>
  axiosError.response?.status === 401 && axiosError.response?.statusText === 'Unauthorized';

const isCloudFlareError = (axiosError: AxiosError): boolean =>
  axiosError.response?.status === 520 && (axiosError.response?.data as string).includes('Cloudflare');

export const exponentialDelay = (
  retryNumber = 0,
  _error: AxiosError | undefined = undefined,
  delayFactor = 100,
): number => {
  const delay = 2 ** retryNumber * delayFactor;
  const randomSum = delay * 0.2 * Math.random(); // 0-20% of the delay
  return delay + randomSum;
};
