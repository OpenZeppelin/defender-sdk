import retry from 'async-retry';
import { createUnauthorizedApi } from './api';

export type AuthType = 'admin' | 'relay';

export type AuthCredentials = {
  apiKey: string;
  secretKey: string;
  type: AuthType;
};

export type RefreshCredentials = {
  apiKey: string;
  secretKey: string;
  refreshToken: string;
  type: AuthType;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export async function authenticateV2(credentials: AuthCredentials, apiUrl: string): Promise<AuthResponse> {
  const api = createUnauthorizedApi(apiUrl);
  try {
    const res = await retry(() => api.post<AuthResponse>('/auth/login', { body: credentials }), { retries: 3 });
    if (res.status !== 200) {
      throw new Error(`Failed to get a token for the API key ${credentials.apiKey}: ${res.statusText}`);
    }
    return res.data;
  } catch (err) {
    const errorMessage = (err as Error).message || err;
    throw new Error(`Failed to get a token for the API key ${credentials.apiKey}: ${errorMessage}`);
  }
}

export async function refreshSessionV2(credentials: RefreshCredentials, apiUrl: string): Promise<AuthResponse> {
  const api = createUnauthorizedApi(apiUrl);
  try {
    const res = await retry(() => api.post<AuthResponse>('/auth/refresh-token', { body: credentials }), { retries: 3 });
    if (res.status !== 200) {
      throw new Error(`Failed to refresh token for the API key ${credentials.apiKey}: ${res.statusText}`);
    }
    return res.data;
  } catch (err) {
    const errorMessage = (err as Error).message || err;
    throw new Error(`Failed to refresh token for the API key ${credentials.apiKey}: ${errorMessage}`);
  }
}
