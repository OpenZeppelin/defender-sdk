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

export interface CreateApprovalProcessRequest {
  name: string;
  component?: ComponentType;
  network: Network;
  via?: string;
  viaType?:
    | 'EOA'
    | 'Contract'
    | 'Multisig'
    | 'Gnosis Safe'
    | 'Safe'
    | 'Gnosis Multisig'
    | 'Relayer'
    | 'Unknown'
    | 'Timelock Controller'
    | 'ERC20'
    | 'Governor'
    | 'Fireblocks';
  timelock?: Timelock;
  multisigSender?: string;
  fireblocks?: FireblocksProposalParams;
  relayerId?: string;
  stackResourceId?: string;
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
    | 'Unknown'
    | 'Timelock Controller'
    | 'ERC20'
    | 'Governor'
    | 'Fireblocks';
  timelock?: Timelock;
  multisigSender?: string;
  fireblocks?: FireblocksProposalParams;
  relayerId?: string;
  stackResourceId?: string;
}
