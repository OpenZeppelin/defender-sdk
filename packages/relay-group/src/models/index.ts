import { Network } from '@openzeppelin/defender-sdk-base-client';

export type Address = string;
export type BigUInt = string | number;
export type PrivateTransactionMode = FlashbotTransactionMode;
/**
 * Fast mode has 2 key differences from the default Protect experience:
 * 1. Shared with all builders: By default, Protect transactions are only shared with the Flashbots Builder, which builds only a subset of all Ethereum blocks. In fast mode, transactions are shared with all registered builders to increase the number of blocks the user's transaction can be included in.
 * 2. Larger refund paid to validator: By default, only 10% of MEV-Share refunds are paid to validators. In fast mode, validators receive 50% of refunds which makes it more likely that the user’s transactions will be chosen in a given block.
 */
export type FlashbotTransactionMode = 'flashbots-normal' | 'flashbots-fast';

export interface RelayerGroupPolicies {
  gasPriceCap?: BigUInt;
  whitelistReceivers?: Address[];
  EIP1559Pricing?: boolean;
  privateTransactions?: boolean | PrivateTransactionMode;
}

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

export type RelayerGroupRelayer = {
  relayerId: string;
  address: string;
  keyId: string;
  relayerShortId: string;
  network: Network;
};

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

export interface CreateRelayerGroupRequest {
  name: string;
  policies?: RelayerGroupPolicies;
  network: Network;
  minBalance: BigUInt;
  stackResourceId?: string;
  relayers?: number;
}

export interface UpdateRelayerGroupRequest {
  name?: string;
  paused?: boolean;
  stackResourceId?: string;
  policies?: RelayerGroupPolicies;
  minBalance?: BigUInt;
  notificationChannels?: {
    events: ('pending' | 'sent' | 'submitted' | 'inmempool' | 'mined' | 'confirmed' | 'failed' | 'expired')[];
    notificationIds: string[];
  };
}

export interface RelayerApiKey {
  keyId: string;
  relayerId: string;
  relayerGroupId?: string;
  secretKey?: string;
  apiKey: string;
  createdAt: string;
  stackResourceId?: string;
}

export interface DeleteRelayerApiKeyResponse {
  message: string;
}

export interface CreateKeyParams {
  stackResourceId?: string;
}
