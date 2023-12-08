export { NetworkClient } from './api';

export {
  TenantNetworkCreateRequest,
  TenantNetworkUpdateRequest,
  ListNetworkRequestOptions,
  NetworkType,
  TenantNetworkType,
  TenantNetworkResponse,
} from './models/networks';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;
