import { ApiRelayerParams, ActionRelayerParams, BigUInt } from '../models/relayer';
import { RelayerTransactionPayload } from '../models/transactions';
import { Relayer } from '../relayer';

export function isActionCredentials(
  credentials: ActionRelayerParams | ApiRelayerParams,
): credentials is ActionRelayerParams {
  const actionCredentials = credentials as ActionRelayerParams;
  return !!actionCredentials.credentials;
}

export function isApiCredentials(credentials: ActionRelayerParams | ApiRelayerParams): credentials is ApiRelayerParams {
  const apiCredentials = credentials as ApiRelayerParams;
  return !!apiCredentials.apiKey && !!apiCredentials.apiSecret;
}

export function validatePayload(payload: RelayerTransactionPayload) {
  if (
    isEIP1559Tx(payload) &&
    BigInt(payload.maxFeePerGas as BigUInt) < BigInt(payload.maxPriorityFeePerGas as BigUInt)
  ) {
    throw new Error('maxFeePerGas should be greater or equal to maxPriorityFeePerGas');
  }
  if (payload.validUntil && new Date(payload.validUntil).getTime() < new Date().getTime()) {
    throw new Error('The validUntil time cannot be in the past');
  }
  if (!payload.to && !payload.data) {
    throw new Error('Both txs `to` and `data` fields are missing. At least one of them has to be set.');
  }
  return payload;
}

// If a tx-like object is representing a EIP1559 transaction (type 2)
export function isEIP1559Tx<TransactionLikeType extends object>(
  tx: TransactionLikeType,
): tx is TransactionLikeType & {
  maxPriorityFeePerGas: NonNullable<unknown>;
  maxFeePerGas: NonNullable<unknown>;
} {
  return 'maxPriorityFeePerGas' in tx && 'maxFeePerGas' in tx;
}

// If a tx-like object is representing a legacy transaction (type 0)
export function isLegacyTx<TransactionLikeType extends object>(
  tx: TransactionLikeType,
): tx is TransactionLikeType & { gasPrice: NonNullable<unknown> } {
  // Consider that an EIP1559 tx may have `gasPrice` after
  // https://github.com/OpenZeppelin/defender/pull/2838
  // that's why the !isEIP1559Tx check
  return 'gasPrice' in tx && !isEIP1559Tx(tx);
}

export function isRelayer(params: any): params is Relayer {
  return typeof params === 'object' && !!params.getRelayer;
}
