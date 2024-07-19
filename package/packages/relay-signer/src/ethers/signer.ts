/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Signature,
  toUtf8Bytes,
  JsonRpcProvider,
  TransactionRequest,
  TransactionResponse,
  TypedDataDomain,
  TypedDataField,
  TypedDataEncoder,
  hexlify,
  BytesLike,
  resolveProperties,
  TransactionLike,
  resolveAddress,
  JsonRpcSigner,
  toBeHex,
} from 'ethers';
import { Relayer } from '../relayer';
import { omit } from 'lodash';
import { PrivateTransactionMode, Speed } from '../models/transactions';
import { EthersVersion, RelayerParams } from '../models/relayer';
import { isEIP1559Tx, isLegacyTx, isRelayer } from './utils';

export type Deferrable<T> = {
  [K in keyof T]: T[K] | Promise<T[K]>;
};

const allowedTransactionKeys: Array<string> = [
  'chainId',
  'data',
  'from',
  'gasLimit',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
  'nonce',
  'to',
  'value',
  'speed',
  'isPrivate',
  'privateMode',
];

type GasOptions = Pick<TransactionLike<string>, 'gasPrice' | 'maxFeePerGas' | 'maxPriorityFeePerGas'>;

export type DefenderTransactionRequest = TransactionLike<string> &
  Partial<{ speed: Speed; validUntil: Date | string; isPrivate?: boolean; privateMode?: PrivateTransactionMode }>;

export type DefenderRelaySignerOptions = Partial<
  GasOptions & {
    speed: Speed;
    validForSeconds: number;
    ethersVersion?: EthersVersion;
  }
>;

type ProviderWithWrapTransaction = JsonRpcProvider & {
  _wrapTransactionResponse(tx: TransactionLike, hash?: string): TransactionResponse;
};

export class DefenderRelaySigner extends JsonRpcSigner {
  private readonly relayer: Relayer;

  constructor(
    readonly relayerCredentials: RelayerParams | Relayer,
    provider: JsonRpcProvider,
    address: string,
    readonly options: DefenderRelaySignerOptions = {},
  ) {
    super(provider, address);
    this.relayer = isRelayer(relayerCredentials) ? relayerCredentials : new Relayer(relayerCredentials);
    if (options) {
      const getUnnecesaryExtraFields = (invalidFields: (keyof GasOptions)[]) =>
        invalidFields.map((field: keyof GasOptions) => options[field]).filter(Boolean);

      if (options.speed) {
        const unnecesaryExtraFields = getUnnecesaryExtraFields(['maxFeePerGas', 'maxPriorityFeePerGas', 'gasPrice']);

        if (unnecesaryExtraFields.length > 0)
          throw new Error(`Inconsistent options: speed + (${unnecesaryExtraFields}) not allowed`);
      } else if (options.gasPrice) {
        const unnecesaryExtraFields = getUnnecesaryExtraFields([
          'maxFeePerGas',
          'maxPriorityFeePerGas',
          // speed already checked
        ]);

        if (unnecesaryExtraFields.length > 0)
          throw new Error(`Inconsistent options: gasPrice + (${unnecesaryExtraFields}) not allowed`);
      } else if (options.maxFeePerGas && options.maxPriorityFeePerGas) {
        if (options.maxFeePerGas < options.maxPriorityFeePerGas)
          throw new Error('Inconsistent options: maxFeePerGas should be greater or equal to maxPriorityFeePerGas');
      } else if (options.maxFeePerGas)
        throw new Error('Inconsistent options: maxFeePerGas without maxPriorityFeePerGas specified');
      else if (options.maxPriorityFeePerGas)
        throw new Error('Inconsistent options: maxPriorityFeePerGas without maxFeePerGas specified');
    }
  }

  public async getAddress(): Promise<string> {
    // cache value because it does not change
    if (!this.address) {
      const r = await this.relayer.getRelayer();
      this.address = r.address;
    }
    return this.address;
  }

  // Returns the signed prefixed-message. This MUST treat:
  // - BytesLike as a binary message
  // - string as a UTF8-message
  // i.e. "0x1234" is a SIX (6) byte string, NOT 2 bytes of data
  public async signMessage(message: string | BytesLike): Promise<string> {
    if (typeof message === 'string') {
      message = toUtf8Bytes(message);
    }

    const sig = await this.relayer.sign({
      message: hexlify(message),
    });
    return Signature.from(sig).serialized;
  }

  // Signs a transaction and returns the fully serialized, signed transaction.
  // The EXACT transaction MUST be signed, and NO additional properties to be added.
  // - This MAY throw if signing transactions is not supports, but if
  //   it does, sentTransaction MUST be overridden.
  public async signTransaction(transaction: TransactionRequest): Promise<string> {
    throw new Error('DefenderRelaySigner#signTransaction: method not yet supported');
  }

  public connect(provider: JsonRpcProvider): DefenderRelaySigner {
    return new DefenderRelaySigner(this.relayerCredentials, provider, this.address, this.options);
  }

  signTypedData(
    domain: TypedDataDomain,
    types: Record<string, TypedDataField[]>,
    value: Record<string, any>,
  ): Promise<string> {
    return this._signTypedData(domain, types, value);
  }

  public async sendTransaction(transaction: DefenderTransactionRequest): Promise<TransactionResponse> {
    const tx = await this.populateTransaction(transaction);
    if (!tx.gasLimit) throw new Error('DefenderRelaySigner#sendTransacton: relayer gas estimation not yet supported');
    const nonce = tx.nonce === undefined ? undefined : BigInt(tx.nonce ?? '0').valueOf();

    let payloadGasParams;

    if (isLegacyTx(tx) && tx.gasPrice !== undefined) {
      payloadGasParams = {
        gasPrice: toBeHex(tx.gasPrice),
      };
    } else if (isEIP1559Tx(tx) && tx.maxFeePerGas !== undefined && tx.maxPriorityFeePerGas !== undefined) {
      payloadGasParams = {
        maxFeePerGas: toBeHex(tx.maxFeePerGas),
        maxPriorityFeePerGas: toBeHex(tx.maxPriorityFeePerGas),
      };
    }

    const payload = {
      to: tx.to?.toString(),
      gasLimit: toBeHex(tx.gasLimit),
      data: tx.data ? toBeHex(tx.data) : undefined,
      speed: tx.speed,
      value: tx.value ? toBeHex(tx.value) : undefined,
      validUntil: tx.validUntil ? new Date(tx.validUntil).toISOString() : undefined,
      isPrivate: tx.isPrivate,
      privateMode: tx.privateMode,
      ...payloadGasParams,
    };

    const relayedTransaction = nonce
      ? await this.relayer.replaceTransactionByNonce(Number(nonce), payload)
      : await this.relayer.sendTransaction(payload);

    let gasParams;

    if (isEIP1559Tx(relayedTransaction)) {
      gasParams = {
        maxFeePerGas: BigInt(relayedTransaction.maxFeePerGas.toString()),
        maxPriorityFeePerGas: BigInt(relayedTransaction.maxPriorityFeePerGas.toString()),
      };
    } else {
      gasParams = {
        gasPrice: BigInt(relayedTransaction.gasPrice.toString()),
      };
    }

    return (this.provider as ProviderWithWrapTransaction)._wrapTransactionResponse(
      {
        ...omit(relayedTransaction, 'gasPrice', 'maxPriorityFeePerGas', 'maxFeePerGas'),
        ...gasParams,
        gasLimit: BigInt(relayedTransaction.gasLimit.toString()),
        value: BigInt(relayedTransaction.value?.toString() ?? '0'),
        data: relayedTransaction.data ?? '',
        signature: relayedTransaction.signature,
      },
      relayedTransaction.hash,
    );
  }

  // Adapted from ethers-io/ethers.js/packages/abstract-signer/src.ts/index.ts
  // Defender relay does not require all fields to be populated
  async populateTransaction(transaction: DefenderTransactionRequest): Promise<DefenderTransactionRequest> {
    const tx: DefenderTransactionRequest = await resolveProperties(this.checkTransaction(transaction));
    if (tx.to != null) {
      // relayer provider acts as name resolver if parameter is an ENS name
      tx.to = await resolveAddress(tx.to, this.provider);
    }

    if (tx.gasLimit == null) {
      tx.gasLimit = await this.estimateGas(tx as DefenderTransactionRequest).catch((error) => {
        console.error('cannot estimate gas; transaction may fail or may require manual gas limit', {
          error: error,
          tx: tx,
        });
        return null;
      });
    }

    if (!tx.speed && !tx.gasPrice && !tx.maxFeePerGas && !tx.maxPriorityFeePerGas) {
      if (this.options.gasPrice) {
        tx.gasPrice = this.options.gasPrice;
      } else if (this.options.maxFeePerGas && this.options.maxPriorityFeePerGas) {
        tx.maxFeePerGas = this.options.maxFeePerGas;
        tx.maxPriorityFeePerGas = this.options.maxPriorityFeePerGas;
      } else if (this.options.speed) {
        tx.speed = this.options.speed;
      }
    }

    if (!tx.validUntil && this.options.validForSeconds) {
      tx.validUntil = new Date(Date.now() + this.options.validForSeconds * 1000);
    }

    return tx;
  }

  // Adapted from ethers-io/ethers.js/packages/abstract-signer/src.ts/index.ts
  // Defender relay accepts more transaction keys
  checkTransaction(transaction: Deferrable<DefenderTransactionRequest>): Deferrable<DefenderTransactionRequest> {
    for (const key in transaction) {
      if (allowedTransactionKeys.indexOf(key) === -1) {
        console.error('invalid transaction key: ' + key, 'transaction', transaction);
      }
    }
    const tx: Deferrable<DefenderTransactionRequest> = { ...transaction };

    tx.from = Promise.all([Promise.resolve(tx.from), this.getAddress()]).then((result) => {
      if (!!result[0] && result[0].toLowerCase() !== result[1].toLowerCase()) {
        console.error('from address mismatch', 'transaction', transaction);
      }
      return result[1];
    });

    return tx;
  }

  /**
   * Signs the typed data value with types data structure for domain using the EIP-712 specification.
   * https://eips.ethereum.org/EIPS/eip-712
   *
   * @param domain EIP712Domain containing name, version, chainId, verifyingContract and salt. All optional
   * @param types set of all types encompassed by struct
   * @param value typed data to sign matching provided types
   * @returns typed data signature
   */
  async _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ): Promise<string> {
    const domainSeparator = TypedDataEncoder.hashDomain(domain);
    const hashStructMessage = TypedDataEncoder.from(types).hash(value);

    const sig = await this.relayer.signTypedData({
      domainSeparator: hexlify(domainSeparator),
      hashStructMessage: hexlify(hashStructMessage),
    });

    return Signature.from(sig).serialized;
  }
}
