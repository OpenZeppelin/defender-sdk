import { Network } from '@openzeppelin/defender-sdk-base-client';

export type ComponentType = ('deploy' | 'upgrade')[];

export interface Timelock {
  address: string;
  delay: string;
}
export interface FireblocksProposalParams {
  apiKeyId: string;
  vaultId: string;
  assetId: string;
}

export type CreateApprovalProcessRequest =
  | GenericApprovalProcessRequest
  | MultisigApprovalProcessRequest
  | RelayerApprovalProcessRequest
  | RelayerGroupApprovalProcessRequest
  | TimelockControllerApprovalProcessRequest
  | FireblocksApprovalProcessRequest;

export interface BaseApprovalProcessRequest {
  name: string;
  /**
   * When the approval process meant to be used in deployment environments
   * it requires a component property to indicate the type of operation: 'deploy' or 'upgrade'
   */
  component?: ComponentType;
  network: Network;
  /**
   * Address of the approval process. It could be Contract, EOA, Relayer or any other kind of address.
   */
  via: string;
  stackResourceId?: string;
}

export interface GenericApprovalProcessRequest extends BaseApprovalProcessRequest {
  viaType: 'EOA' | 'Contract' | 'Unknown' | 'ERC20' | 'Governor';
}

export interface MultisigApprovalProcessRequest extends BaseApprovalProcessRequest {
  viaType: 'Multisig' | 'Gnosis Safe' | 'Safe' | 'Gnosis Multisig';
  multisigSender: string;
}

export interface RelayerApprovalProcessRequest extends BaseApprovalProcessRequest {
  viaType: 'Relayer';
  relayerId: string;
}

export interface RelayerGroupApprovalProcessRequest extends BaseApprovalProcessRequest {
  viaType: 'Relayer Group';
  relayerGroupId: string;
}

export interface TimelockControllerApprovalProcessRequest extends BaseApprovalProcessRequest {
  viaType: 'Timelock Controller';
  timelock: Timelock;
}

export interface FireblocksApprovalProcessRequest extends BaseApprovalProcessRequest {
  viaType: 'Fireblocks';
  fireblocks: FireblocksProposalParams;
}

export interface CreateApprovalProcessResponse {
  approvalProcessId: string;
  createdAt: string;
  name: string;
  component?: ComponentType;
  network?: Network;
  via?: string;
  viaType?:
    | 'EOA'
    | 'Contract'
    | 'Multisig'
    | 'Gnosis Safe'
    | 'Safe'
    | 'Gnosis Multisig'
    | 'Relayer'
    | 'Relayer Group'
    | 'Unknown'
    | 'Relayer Group'
    | 'Timelock Controller'
    | 'ERC20'
    | 'Governor'
    | 'Fireblocks';
  timelock?: Timelock;
  multisigSender?: string;
  fireblocks?: FireblocksProposalParams;
  relayerId?: string;
  relayerGroupId?: string;
  stackResourceId?: string;
}
