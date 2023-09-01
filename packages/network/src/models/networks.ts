import { Network } from '@openzeppelin/defender-sdk-base-client';

export type NetworkType = 'production' | 'test';
export interface ListNetworkRequestOptions {
  networkType?: NetworkType;
}

export interface ForkedNetworkCreateRequest {
  name: string;
  forkedNetwork: Network;
  rpcUrl: string;
  blockExplorerUrl?: string;
  apiKey?: string;
}

export interface ForkedNetworkUpdateRequest {
  forkedNetworkId: string;
  apiKey?: string;
  blockExplorerUrl?: string;
}

export interface ForkedNetworkResponse {
  forkedNetworkId: string;
  name: string;
  chainId: number;
  forkedNetwork: Network;
  rpcUrl: string;
  apiKey?: string;
  blockExplorerUrl?: string;
  createdAt: string;
  createdBy: string;
}
