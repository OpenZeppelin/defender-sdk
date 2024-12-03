import https from 'https';
import { Network, AuthConfig } from '@openzeppelin/defender-sdk-base-client';
import {
  ListTransactionsRequest,
  PaginatedTransactionResponse,
  PrivateTransactionMode,
  RelayerTransaction,
  RelayerTransactionPayload,
  TransactionDeleteResponse,
} from './transactions';
import { JsonRpcResponse, SignMessagePayload, SignTypedDataPayload, SignedMessagePayload } from './rpc';

// TODO Defender Address model for this
export type Address = string;

export type BigUInt = string | number;

export type RelayerParams = ApiRelayerParams | ActionRelayerParams;

export type ApiRelayerParams = {
  apiKey: string;
  apiSecret?: string;
  accessToken?: string;
  httpsAgent?: https.Agent;
  authConfig: AuthConfig;
};
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

export interface RelayerGroupStatus {
  relayerGroupId: string;
  name: string;
  numberOfPendingTransactions: number;
  paused: boolean;
  txsQuotaUsage: number;
  rpcQuotaUsage: number;
  healthStatus?: {
    updatedAt?: string;
    weightByRelayer?: {
      [k: string]: number;
    };
  };
  relayers: {
    relayerId: string;
    name: string;
    nonce: number;
    address: string;
    numberOfPendingTransactions: number;
    paused: boolean;
    pendingTxCost?: string;
    lastConfirmedTransaction?: {
      hash: string;
      status: string;
      minedAt: string;
      sentAt: string;
      nonce: number;
    };
  }[];
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

export interface RelayerGroupPolicies {
  gasPriceCap?: BigUInt;
  whitelistReceivers?: Address[];
  EIP1559Pricing?: boolean;
  privateTransactions?: boolean | PrivateTransactionMode;
}

export type RelayerGroupRelayer = {
  relayerId: string;
  address: string;
  keyId: string;
  relayerShortId: string;
  network: Network;
};

export enum TxStatus {
  Pending = 'pending', // temporary status, pre-sent
  Sent = 'sent', // sent to SQS from API
  Submitted = 'submitted', // sent to ethereum (infura/alchemy)
  InMemPool = 'inmempool', // no blocknumber assigned yet
  Mined = 'mined', // blocknumber assigned
  Confirmed = 'confirmed', // mined AND older than 12 blocks
  Failed = 'failed', // terminal failure for any reason (bad nonce, too many retries)
  Expired = 'expired', // transaction was not sent before validUntil expired (currently only used for intents)
}

export interface RelayerGroupResponse {
  relayerGroupId: string;
  name: string;
  network: Network;
  policies: RelayerGroupPolicies;
  minBalance: BigUInt;
  relayers: RelayerGroupRelayer[];
  paused: boolean;
  systemPaused: boolean;
  createdAt: string;
  stackResourceId?: string;
  notificationChannels?: {
    events: TxStatus[];
    notificationIds: string[];
  };
}

export type EthersVersion = 'v5' | 'v6';

export interface IRelayer {
  getRelayer(): Promise<RelayerGetResponse | RelayerGroupResponse>;
  getRelayerStatus(): Promise<RelayerStatus | RelayerGroupStatus>;
  sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  replaceTransactionById(id: string, payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  replaceTransactionByNonce(nonce: number, payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  cancelTransactionById(id: string): Promise<TransactionDeleteResponse>;
  getTransaction(id: string): Promise<RelayerTransaction>;
  getTransactionByNonce(nonce: number): Promise<RelayerTransaction>;
  listTransactions(criteria?: ListTransactionsRequest): Promise<RelayerTransaction[] | PaginatedTransactionResponse>;
  sign(payload: SignMessagePayload): Promise<SignedMessagePayload>;
  signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload>;
  call(params: { method: string; params: string[] }): Promise<JsonRpcResponse>;
  getApiKey(): string;
  getAccessToken(): Promise<string>;
}
