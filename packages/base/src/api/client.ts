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
  private apiSecret: string | undefined;
  private httpsAgent?: https.Agent;
  private retryConfig: RetryConfig;
  private accessToken: string | undefined;

  protected abstract getPoolId(): string;
  protected abstract getPoolClientId(): string;
  protected abstract getApiUrl(): string;

  public constructor(params: {
    apiKey?: string;
    apiSecret?: string;
    httpsAgent?: https.Agent;
    retryConfig?: Partial<RetryConfig>;
    accessToken?: string;
  }) {
    if (!params.apiKey) throw new Error(`API key is required`);
    if (!params.apiSecret && !params.accessToken) throw new Error(`API secret or access token is required`);

    this.apiKey = params.apiKey;
    this.apiSecret = params.apiSecret;
    this.accessToken = params.accessToken;
    this.httpsAgent = params.httpsAgent;
    this.retryConfig = { retries: 3, retryDelay: exponentialDelay, ...params.retryConfig };
  }

  protected getKey(): string {
    return this.apiKey;
  }

  protected async getToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;
    if (!this.apiSecret) throw new Error('Cannot authenticate without API secret.');

    const userPass = { Username: this.apiKey, Password: this.apiSecret };
    const poolData = { UserPoolId: this.getPoolId(), ClientId: this.getPoolClientId() };
    this.session = await authenticate(userPass, poolData);
    return this.session.getAccessToken().getJwtToken();
  }

  protected async init(): Promise<AxiosInstance> {
    if (!this.api) {
      const token = await this.getToken();
      this.api = createAuthenticatedApi(this.apiKey, token, this.getApiUrl(), this.httpsAgent);
    }
    return this.api;
  }

  protected async refresh(overrides?: { headers: Record<string, string> }): Promise<AxiosInstance> {
    if (!this.session) {
      return this.init();
    }
    if (!this.apiSecret) {
      throw new Error('Cannot refresh session without API secret.');
    }
    try {
      const userPass = { Username: this.apiKey, Password: this.apiSecret };
      const poolData = { UserPoolId: this.getPoolId(), ClientId: this.getPoolClientId() };
      this.session = await refreshSession(userPass, poolData, this.session);
      this.api = createAuthenticatedApi(
        userPass.Username,
        this.session.getAccessToken().getJwtToken(),
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
      // this means ID token has expired
      if (isAuthenticationError(error)) {
        // if using custom access token, throw error.
        if (this.accessToken) throw error;

        this.api = undefined;

        const api = await this.refresh();
        return await this.withRetry(api, apiFunction, { retryCount, retryDelay });
      }

      const updatedRetryState = {
        retryCount: retryCount + 1,
        retryDelay: this.retryConfig.retryDelay(retryCount + 1, error),
      };

      if (updatedRetryState.retryCount > this.retryConfig.retries) throw error;

      if (isCloudFlareError(error) && this.apiSecret) {
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
