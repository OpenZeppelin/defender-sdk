import { ExternalApiCreateProposalRequest } from './proposal';
import { ExternalApiProposalResponse as ProposalResponse } from './response';
import { SimulationResponse } from './simulation';

export interface ExternalApiProposalResponse extends ExternalApiCreateProposalRequest {
  contractIds?: string[];
  contractId: string;
  proposalId: string;
  createdAt: string;
  isActive: boolean;
  isArchived: boolean;
}
export interface ProposalResponseWithUrl extends ProposalResponse {
  url: string;
  simulation?: SimulationResponse;
}
