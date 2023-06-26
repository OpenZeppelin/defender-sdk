import { Address, BigUInt } from "./relayer";

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
};
