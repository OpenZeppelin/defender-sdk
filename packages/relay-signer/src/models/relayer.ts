import https from 'https';
import { Network, AuthConfig } from '@openzeppelin/defender-sdk-base-client';
import {
  ListTransactionsRequest,
  PaginatedTransactionResponse,
  PrivateTransactionMode,
  RelayerTransaction,
  RelayerTransactionPayload,
} from './transactions';
import { JsonRpcResponse, SignMessagePayload, SignTypedDataPayload, SignedMessagePayload } from './rpc';

// TODO Defender Address model for this
export type Address = string;

export type BigUInt = string | number;

export type RelayerParams = ApiRelayerParams | ActionRelayerParams;
export type ApiRelayerParams = { apiKey: string; apiSecret: string; httpsAgent?: https.Agent; authConfig: AuthConfig };
export type ActionRelayerParams = {
  credentials: string;
  relayerARN: string;
  httpsAgent?: https.Agent;
  authConfig: AuthConfig;
};

export interface RelayerGetResponse {
  relayerId: string;
  name: string;
  address: string;
  network: Network;
  paused: boolean;
  createdAt: string;
  pendingTxCost: string;
  minBalance: BigUInt;
  policies: UpdateRelayerPoliciesRequest;
  stackResourceId?: string;
}

export interface RelayerStatus {
  relayerId: string;
  name: string;
  nonce: number;
  address: string;
  numberOfPendingTransactions: number;
  paused: boolean;
  pendingTxCost?: string;
  txsQuotaUsage: number;
  rpcQuotaUsage: number;
  lastConfirmedTransaction?: {
    hash: string;
    status: string;
    minedAt: string;
    sentAt: string;
    nonce: number;
  };
}

export interface UpdateRelayerPoliciesRequest {
  gasPriceCap?: BigUInt;
  whitelistReceivers?: Address[];
  EIP1559Pricing?: boolean;
  /**
   * Allowing boolean for backwards compatibility.
   * New relayers should use PrivateTransactionMode.
   */
  privateTransactions?: boolean | PrivateTransactionMode;
}

export type EthersVersion = 'v5' | 'v6';

export interface IRelayer {
  getRelayer(): Promise<RelayerGetResponse>;
  getRelayerStatus(): Promise<RelayerStatus>;
  sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  replaceTransactionById(id: string, payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  replaceTransactionByNonce(nonce: number, payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  getTransaction(id: string): Promise<RelayerTransaction>;
  listTransactions(criteria?: ListTransactionsRequest): Promise<RelayerTransaction[] | PaginatedTransactionResponse>;
  sign(payload: SignMessagePayload): Promise<SignedMessagePayload>;
  signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload>;
  call(params: { method: string; params: string[] }): Promise<JsonRpcResponse>;
}
