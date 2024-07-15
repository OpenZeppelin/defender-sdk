import { Address, BigUInt } from './relayer';

export type Speed = 'safeLow' | 'average' | 'fast' | 'fastest';
export type Status = 'pending' | 'sent' | 'submitted' | 'inmempool' | 'mined' | 'confirmed' | 'failed';
export type Hex = string;

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

export type PrivateTransactionMode = FlashbotTransactionMode;
/**
 * Fast mode has 2 key differences from the default Protect experience:
 * 1. Shared with all builders: By default, Protect transactions are only shared with the Flashbots Builder, which builds only a subset of all Ethereum blocks. In fast mode, transactions are shared with all registered builders to increase the number of blocks the user's transaction can be included in.
 * 2. Larger refund paid to validator: By default, only 10% of MEV-Share refunds are paid to validators. In fast mode, validators receive 50% of refunds which makes it more likely that the user’s transactions will be chosen in a given block.
 */
export type FlashbotTransactionMode = 'flashbots-normal' | 'flashbots-fast';

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
  signature?: {
    v: string;
    r: string;
    s: string;
  };
}

interface RelayerLegacyTransaction extends RelayerTransactionBase {
  gasPrice: number;
}

interface RelayerEIP1559Transaction extends RelayerTransactionBase {
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
}

export type RelayerTransaction = RelayerLegacyTransaction | RelayerEIP1559Transaction;

export type ListTransactionsRequest = {
  status?: 'pending' | 'mined' | 'failed';
  since?: Date;
  limit?: number;
  next?: string;
  sort?: 'asc' | 'desc';
};

export type PaginatedTransactionResponse = {
  items: RelayerTransaction[];
  next?: string;
};
