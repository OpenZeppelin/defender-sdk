export { NetworkClient } from './api';

export {
  ForkedNetworkCreateRequest,
  ForkedNetworkUpdateRequest,
  ListNetworkRequestOptions,
  NetworkType,
  ForkedNetworkResponse,
} from './models/networks';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;
