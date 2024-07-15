import { Network } from '@openzeppelin/defender-sdk-base-client';
import https from 'https';

export type Address = string;
export type BigintLike = string | number | bigint | boolean;
export type BigUInt = string | number;
export type Hex = string;
export type Speed = 'safeLow' | 'average' | 'fast' | 'fastest';
export type Status = 'pending' | 'sent' | 'submitted' | 'inmempool' | 'mined' | 'confirmed' | 'failed';

export type PrivateTransactionMode = FlashbotTransactionMode;
/**
 * Fast mode has 2 key differences from the default Protect experience:
 * 1. Shared with all builders: By default, Protect transactions are only shared with the Flashbots Builder, which builds only a subset of all Ethereum blocks. In fast mode, transactions are shared with all registered builders to increase the number of blocks the user's transaction can be included in.
 * 2. Larger refund paid to validator: By default, only 10% of MEV-Share refunds are paid to validators. In fast mode, validators receive 50% of refunds which makes it more likely that the user’s transactions will be chosen in a given block.
 */
export type FlashbotTransactionMode = 'flashbots-normal' | 'flashbots-fast';

export interface SendBaseTransactionRequest {
  to?: Address;
  value?: BigUInt;
  data?: Hex;
  gasLimit: BigUInt;
  validUntil?: string;
  isPrivate?: boolean;
  privateMode?: PrivateTransactionMode;
}

export interface SendSpeedTransactionRequest extends SendBaseTransactionRequest {
  speed: Speed;
}

export interface SendLegacyTransactionRequest extends SendBaseTransactionRequest {
  gasPrice: BigUInt;
}

export interface SendEIP1559TransactionRequest extends SendBaseTransactionRequest {
  maxFeePerGas: BigUInt;
  maxPriorityFeePerGas: BigUInt;
}

export type RelayerTransactionPayload =
  | SendBaseTransactionRequest
  | SendSpeedTransactionRequest
  | SendLegacyTransactionRequest
  | SendEIP1559TransactionRequest;

export interface SignMessagePayload {
  message: Hex;
}

export interface SignTypedDataPayload {
  domainSeparator: Hex;
  hashStructMessage: Hex;
}

export interface SignedMessagePayload {
  sig: Hex;
  r: Hex;
  s: Hex;
  v: number;
}

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

// updating reference interface name RelayerGetResponse to match conventions
// maintaining RelayerModel interface name below to prevent breaking TS implementations
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RelayerModel extends RelayerGetResponse {}

export interface RelayerListResponse {
  items: RelayerGetResponse[];
  txsQuotaUsage: number;
}

export interface CreateRelayerRequest {
  name: string;
  useAddressFromRelayerId?: string;
  network: Network;
  minBalance: BigUInt;
  policies?: UpdateRelayerPoliciesRequest;
  stackResourceId?: string;
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

export interface UpdateRelayerRequest {
  name?: string;
  policies?: UpdateRelayerPoliciesRequest;
  minBalance?: BigUInt;
  stackResourceId?: string;
  notificationChannels?: {
    events: ('pending' | 'sent' | 'submitted' | 'inmempool' | 'mined' | 'confirmed' | 'failed')[];
    notificationIds: string[];
  };
}

export interface RelayerApiKey {
  keyId: string;
  relayerId: string;
  secretKey?: string;
  apiKey: string;
  createdAt: string;
  stackResourceId?: string;
}

export interface DeleteRelayerApiKeyResponse {
  message: string;
}

// from openzeppelin/defender/models/src/types/tx.res.ts
interface RelayerTransactionBase {
  transactionId: string;
  hash: string;
  to: Address;
  from: Address;
  value?: string;
  data?: string;
  speed?: Speed;
  gasLimit: number;
  nonce: number;
  status: Status;
  chainId: number;
  validUntil: string;
  createdAt: string;
  sentAt?: string;
  pricedAt?: string;
  isPrivate?: boolean;
  privateMode?: PrivateTransactionMode;
}

interface RelayerLegacyTransaction extends RelayerTransactionBase {
  gasPrice: number;
}

interface RelayerEIP1559Transaction extends RelayerTransactionBase {
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
}

export type RelayerTransaction = RelayerLegacyTransaction | RelayerEIP1559Transaction;

export type RelayerParams = ApiRelayerParams | ActionRelayerParams;
export type ApiRelayerParams = { apiKey: string; apiSecret: string; httpsAgent?: https.Agent };
export type ActionRelayerParams = { credentials: string; relayerARN: string; httpsAgent?: https.Agent };

export type JsonRpcResponse = {
  id: number | null;
  jsonrpc: '2.0';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
  error?: {
    code: number;
    message: string;
    data?: string;
  };
};

export type JsonRpcRequest = {
  id: number;
  jsonrpc: '2.0';
  method: string;
  params: string[];
};

export interface IRelayer {
  getRelayer(): Promise<RelayerGetResponse>;
  sendTransaction(params: { payload: RelayerTransactionPayload }): Promise<RelayerTransaction>;
  replaceTransactionById(params: { id: string; payload: RelayerTransactionPayload }): Promise<RelayerTransaction>;
  replaceTransactionByNonce(params: { nonce: number; payload: RelayerTransactionPayload }): Promise<RelayerTransaction>;
  query(params: { id: string }): Promise<RelayerTransaction>;
  list(params: { criteria?: ListTransactionsRequest }): Promise<RelayerTransaction[]>;
  sign(params: { payload: SignMessagePayload }): Promise<SignedMessagePayload>;
  signTypedData(params: { payload: SignTypedDataPayload }): Promise<SignedMessagePayload>;
  call(params: { method: string; params: string[] }): Promise<JsonRpcResponse>;
}

export type ListTransactionsRequest = {
  status?: 'pending' | 'mined' | 'failed';
  since?: Date;
  limit?: number;
};

export interface CreateKeyParams {
  stackResourceId?: string;
}
