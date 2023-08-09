import https from 'https';
import { Network } from '@openzeppelin/defender-sdk-base-client';
import { ListTransactionsRequest, RelayerTransaction, RelayerTransactionPayload } from './transactions';
import { JsonRpcResponse, SignMessagePayload, SignTypedDataPayload, SignedMessagePayload } from './rpc';

// TODO platform Address model for this
export type Address = string;

export type BigUInt = string | number;

export type RelayerParams = ApiRelayerParams | ActionRelayerParams;
export type ApiRelayerParams = { apiKey: string; apiSecret: string; httpsAgent?: https.Agent };
export type ActionRelayerParams = { credentials: string; relayerARN: string; httpsAgent?: https.Agent };

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

export interface UpdateRelayerPoliciesRequest {
  gasPriceCap?: BigUInt;
  whitelistReceivers?: Address[];
  EIP1559Pricing?: boolean;
  privateTransactions?: boolean;
}

export interface IRelayer {
  getRelayer(): Promise<RelayerGetResponse>;
  sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction>;
  replaceTransactionById(params: { id: string; payload: RelayerTransactionPayload }): Promise<RelayerTransaction>;
  replaceTransactionByNonce(params: { nonce: number; payload: RelayerTransactionPayload }): Promise<RelayerTransaction>;
  getTransaction(params: { id: string }): Promise<RelayerTransaction>;
  listTransactions(criteria?: ListTransactionsRequest): Promise<RelayerTransaction[]>;
  sign(payload: SignMessagePayload): Promise<SignedMessagePayload>;
  signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload>;
  call(params: { method: string; params: string[] }): Promise<JsonRpcResponse>;
}
