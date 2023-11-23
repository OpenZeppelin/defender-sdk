import { SupportedNetwork, TenantNetwork } from '@openzeppelin/defender-sdk-base-client';

export type NetworkType = 'production' | 'test';
export type TenantNetworkType = 'private' | 'fork';

export interface ListNetworkRequestOptions {
  networkType?: NetworkType;
}

export interface TenantNetworkCreateRequest {
  name: TenantNetwork;
  supportedNetwork: SupportedNetwork;
  rpcUrl: string;
  blockExplorerUrl?: string;
  networkType: TenantNetworkType;
  apiKey?: string;
  stackResourceId?: string;
}

export interface TenantNetworkUpdateRequest {
  tenantNetworkId: string;
  apiKey?: string;
  blockExplorerUrl?: string;
  stackResourceId?: string;
}

export interface TenantNetworkResponse {
  tenantNetworkId: string;
  name: TenantNetwork;
  chainId: number;
  supportedNetwork: SupportedNetwork;
  rpcUrl: string;
  apiKey?: string;
  blockExplorerUrl?: string;
  stackResourceId?: string;
  networkType: TenantNetworkType;
  createdAt: string;
  createdBy: string;
}
