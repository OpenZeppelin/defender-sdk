export { Relayer } from './relayer';

export * from './models/relayer';
export * from './models/rpc';
export * from './models/transactions';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;
