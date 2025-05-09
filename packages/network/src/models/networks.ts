import { SupportedNetwork, TenantNetwork } from '@openzeppelin/defender-sdk-base-client';

export type NetworkType = 'production' | 'test' | 'deploy';
export type TenantNetworkType = 'private' | 'fork';
export type Address = string;

export interface ListNetworkRequestOptions {
  networkType?: NetworkType | NetworkType[];
  includeDefinition?: boolean;
}

export interface NetworkDefinition {
  name: string;
  displayName: string;
  chainId: number;
  symbol: string;
  isProduction: boolean;
}

export interface TenantNetworkCreateRequest {
  name: string;
  supportedNetwork?: SupportedNetwork;
  configuration?: TenantNetworkConfiguration;
  rpcUrl: string;
  blockExplorerUrl?: string;
  networkType: TenantNetworkType;
  apiKey?: string;
  stackResourceId?: string;
}

export interface PrivateNetworkCreateRequest extends TenantNetworkCreateRequest {
  isProduction?: boolean;
}

export interface TenantNetworkUpdateRequest {
  tenantNetworkId: string;
  apiKey?: string;
  blockExplorerUrl?: string;
  configuration?: TenantNetworkConfiguration;
  stackResourceId?: string;
}

export interface PrivateNetworkUpdateRequest extends TenantNetworkUpdateRequest {
  isProduction?: boolean;
}

export interface TenantNetworkResponse {
  tenantNetworkId: string;
  name: TenantNetwork;
  chainId: number;
  supportedNetwork?: SupportedNetwork;
  rpcUrl: string;
  apiKey?: string;
  blockExplorerUrl?: string;
  stackResourceId?: string;
  networkType: TenantNetworkType;
  configuration?: TenantNetworkConfiguration;
  createdAt: string;
  createdBy: string;
}

export interface PrivateNetworkResponse extends TenantNetworkResponse {
  isProduction?: boolean;
}

export interface TenantNetworkConfiguration {
  symbol: string;
  eips?: TenantNetworkEIPConfiguration;
  safeContracts?: SafeContracts;
  subgraphURL?: string;
  safeTxServiceURL?: string;
}
export interface TenantNetworkEIPConfiguration {
  isEIP1559?: boolean;
}
export interface SafeContracts {
  master: Address;
  proxyFactory: Address;
  multisendCallOnly: Address;
  createCall?: Address;
}
