export { ProposalClient } from './api';
export { ExternalApiCreateProposalRequest as CreateProposalRequest } from './models/proposal';
export { ProposalResponseWithUrl as ProposalResponse } from './models/response';

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const VERSION = require('../package.json').version;
