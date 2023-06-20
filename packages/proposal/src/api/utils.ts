import { ExternalApiProposalResponse } from '../models/response';

import { PLATFORM_APP_URL } from '@openzeppelin/platform-sdk-base-client';

export function getProposalUrl(proposal: Pick<ExternalApiProposalResponse, 'contractId' | 'proposalId'>): string {
  return `${PLATFORM_APP_URL}/#/admin/contracts/${proposal.contractId}/proposals/${proposal.proposalId}`;
}
