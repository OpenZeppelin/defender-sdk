import { ExternalApiProposalResponse } from '../models/response';

import { DEFENDER_APP_URL } from '@openzeppelin/defender-sdk-base-client';

export function getProposalUrl(proposal: Pick<ExternalApiProposalResponse, 'proposalId'>): string {
  return `${DEFENDER_APP_URL}/v2/#/actions/executable/${proposal.proposalId}`;
}
