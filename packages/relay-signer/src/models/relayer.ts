import https from 'https';
import { Network } from '@openzeppelin/platform-sdk-base-client';

// TODO platform Address model for this
export type Address = string;

export type BigUInt = string | number;

export type RelayerParams = ApiRelayerParams | AutotaskRelayerParams;
export type ApiRelayerParams = { apiKey: string; apiSecret: string; httpsAgent?: https.Agent };
export type AutotaskRelayerParams = { credentials: string; relayerARN: string; httpsAgent?: https.Agent };

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
