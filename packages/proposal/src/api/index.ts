import { BaseApiClient } from '@openzeppelin/platform-sdk-base-client';
import { isArray } from 'lodash';
import { Interface } from 'ethers/lib/utils';
import {
  ExternalApiCreateProposalRequest as CreateProposalRequest,
  PartialContract,
} from '../models/proposal';
import { SimulationRequest as SimulationTransaction, SimulationResponse } from '../models/simulation';
import { ExternalApiProposalResponse as ProposalResponse, ProposalResponseWithUrl } from '../models/response';
import { getProposalUrl } from './utils';

export class ProposalClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.PLATFIRM_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.PLATFIRM_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.PLATFIRM_API_URL || 'https://defender-api.openzeppelin.com/admin/';
  }

  // added separate from CreateProposalRequest type as the `simulate` boolean is contained within defender-client
  public async createProposal(
    proposal: CreateProposalRequest & { simulate?: boolean; overrideSimulationOpts?: SimulationTransaction },
  ): Promise<ProposalResponseWithUrl> {
    return this.apiCall(async (api) => {
      let simulation: SimulationResponse | undefined = undefined;
      let simulationData = '0x';
      const isBatchProposal = (contract: PartialContract | PartialContract[]): contract is PartialContract[] =>
        isArray(contract);

      // handle simulation checks before creating proposal
      if (proposal.simulate) {
        // we do not support simulating batch proposals from the client.
        if (isBatchProposal(proposal.contract)) {
          throw new Error(
            'Simulating a batch proposal is currently not supported from the API. Use the Defender UI to manually trigger a simulation.',
          );
        }
        const overrideData = proposal.overrideSimulationOpts?.transactionData.data;
        simulationData = overrideData ?? '0x';
        // only check if we haven't overridden the simulation data property
        if (!overrideData) {
          // Check if ABI is provided so we can encode the function
          if (!proposal.contract.abi) {
            // no ABI found, request user to pass in `data` in overrideSimulationOpts
            throw new Error(
              'Simulation requested without providing ABI. Please provide the contract ABI or use the `overrideSimulationOpts` to provide the data property directly.',
            );
          }
          const contractInterface = new Interface(proposal.contract.abi);

          // this is defensive and should never happen since createProposal schema validation will fail without this property defined.
          if (!proposal.functionInterface) {
            // no function selected, request user to pass in `data` in overrideSimulationOpts
            throw new Error(
              'Simulation requested without providing function interface. Please provide the function interface or use the `overrideSimulationOpts` to provide the data property directly.',
            );
          }
          simulationData = contractInterface.encodeFunctionData(
            proposal.functionInterface.name!,
            proposal.functionInputs,
          );
        }
      }

      // create proposal
      const response = (await api.post('/proposals', proposal)) as ProposalResponse;

      // create simulation
      if (proposal.simulate && !isBatchProposal(proposal.contract)) {
        try {
          simulation = await this.simulateProposal(response.contractId, response.proposalId, {
            transactionData: {
              from: proposal.via,
              to: proposal.contract.address,
              data: simulationData,
              value: proposal.metadata?.sendValue ?? '0',
              ...proposal.overrideSimulationOpts?.transactionData,
            },
            blockNumber: proposal.overrideSimulationOpts?.blockNumber,
          });
        } catch (e) {
          // simply log so we don't block createProposal response
          console.warn('Simulation Failed:', e);
        }
      }
      return { ...response, url: getProposalUrl(response), simulation };
    });
  }

  public async listProposals(opts: { includeArchived?: boolean } = {}): Promise<ProposalResponseWithUrl[]> {
    return this.apiCall(async (api) => {
      const response = (await api.get('/proposals', { params: opts })) as ProposalResponse[];
      return response.map((proposal) => ({ ...proposal, url: getProposalUrl(proposal) }));
    });
  }

  public async getProposal(contractId: string, proposalId: string): Promise<ProposalResponseWithUrl> {
    return this.apiCall(async (api) => {
      const response = (await api.get(`/contracts/${contractId}/proposals/${proposalId}`)) as ProposalResponse;
      return { ...response, url: getProposalUrl(response) };
    });
  }

  public async archiveProposal(contractId: string, proposalId: string): Promise<ProposalResponseWithUrl> {
    return this.apiCall(async (api) => {
      const response = (await api.put(`/contracts/${contractId}/proposals/${proposalId}/archived`, {
        archived: true,
      })) as ProposalResponse;
      return { ...response, url: getProposalUrl(response) };
    });
  }

  public async unarchiveProposal(contractId: string, proposalId: string): Promise<ProposalResponseWithUrl> {
    return this.apiCall(async (api) => {
      const response = (await api.put(`/contracts/${contractId}/proposals/${proposalId}/archived`, {
        archived: false,
      })) as ProposalResponse;
      return { ...response, url: getProposalUrl(response) };
    });
  }

  public async getProposalSimulation(contractId: string, proposalId: string): Promise<SimulationResponse> {
    return this.apiCall(async (api) => {
      const response = (await api.get(
        `/contracts/${contractId}/proposals/${proposalId}/simulation`,
      )) as SimulationResponse;
      return response;
    });
  }

  public async simulateProposal(
    contractId: string,
    proposalId: string,
    transaction: SimulationTransaction,
  ): Promise<SimulationResponse> {
    return this.apiCall(async (api) => {
      const response = (await api.post(
        `/contracts/${contractId}/proposals/${proposalId}/simulate`,
        transaction,
      )) as SimulationResponse;
      return response;
    });
  }
}
