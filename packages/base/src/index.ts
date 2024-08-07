export { createApi, createAuthenticatedApi } from './api/api';
export { authenticate } from './api/auth';
export { BaseApiClient, RetryConfig, AuthConfig } from './api/client';
export { BaseActionClient } from './action';
export * from './utils/network';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;

export const DEFENDER_APP_URL = 'https://defender.openzeppelin.com';
