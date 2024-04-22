import { mock } from 'jest-mock-extended';
import { omit, pick } from 'lodash';
import { Relayer } from '../relayer';
import { DefenderRelaySigner } from './signer';
import { RelayerTransaction } from '../models/transactions';
import { isEIP1559Tx, isLegacyTx } from './utils';
import {
  Contract,
  ContractRunner,
  JsonRpcProvider,
  Signature,
  TransactionLike,
  TransactionResponse,
  TypedDataEncoder,
  hexlify,
  randomBytes,
} from 'ethers';

type ProviderWithWrapTransaction = JsonRpcProvider & {
  _wrapTransactionResponse(tx: TransactionLike, hash?: string): TransactionResponse;
};

describe('ethers/signer', () => {
  const relayer = mock<Relayer>();
  const provider = mock<ProviderWithWrapTransaction>();
  const from = '0xe800aaf7b88110298433e9d436a92d582119da96';

  const tx: RelayerTransaction = {
    chainId: 4,
    from,
    gasLimit: 60000,
    maxFeePerGas: 10e9,
    maxPriorityFeePerGas: 1e9,
    hash: '0xdfd0144b0ed02b10ee1ca5a6ead42709d1ce495ecb6d28d9c8dfcb0146bd94ed',
    nonce: 30,
    speed: 'safeLow',
    status: 'sent',
    to: '0xc7464dbcA260A8faF033460622B23467Df5AEA42',
    transactionId: '1',
    validUntil: '2031-05-19T23:09:47.129Z',
    data: '0x01',
    value: '0x02',
    createdAt: '2022-10-30T00:11:35.501Z',
  };

  const transferAbi = [
    {
      inputs: [
        { internalType: 'address', name: 'recipient', type: 'address' },
        { internalType: 'uint256', name: 'amount', type: 'uint256' },
      ],
      name: 'transfer',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();

    relayer.getRelayer.mockResolvedValue({
      network: 'sepolia',
      address: from,
      relayerId: '1',
      createdAt: '',
      name: 'My relayer',
      paused: false,
      pendingTxCost: '0',
      minBalance: '100000000000000000',
      policies: {},
    });

    provider._wrapTransactionResponse.mockImplementation((arg) => {
      let gasParams;

      if (isEIP1559Tx(arg)) {
        gasParams = {
          maxFeePerGas: arg.maxFeePerGas,
          maxPriorityFeePerGas: arg.maxPriorityFeePerGas,
        };
      } else {
        gasParams = {
          gasPrice: arg.gasPrice,
        };
      }

      return {
        ...omit({ ...tx, ...arg }, 'gasPrice', 'maxFeePerGas', 'maxPriorityFeePerGas'),
        ...gasParams,
        confirmations: 0,
        wait: () => {
          throw new Error();
        },
      } as any as TransactionResponse;
    });

    provider.resolveName.mockImplementation((arg) => Promise.resolve(arg));
  });

  it('sends a tx with speed', async () => {
    relayer.sendTransaction.mockResolvedValue(tx);

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });
    const request = pick(tx, 'to', 'data', 'value', 'gasLimit');
    const sent = await signer.sendTransaction(request);

    expect(relayer.sendTransaction).toHaveBeenCalledWith({
      ...request,
      gasLimit: '0xea60',
      speed: 'safeLow',
      validUntil: undefined,
      value: '0x02',
    });
  });

  it('sends a tx with fixed gasPrice', async () => {
    relayer.sendTransaction.mockResolvedValue({
      ...omit(tx, 'maxFeePerGas', 'maxPriorityFeePerGas'),
      gasPrice: 1e9,
    });

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });
    const request = { ...pick(tx, 'to', 'data', 'value', 'gasLimit'), gasPrice: 1e9 };
    const sent = await signer.sendTransaction(request);

    expect(relayer.sendTransaction).toHaveBeenCalledWith({
      ...request,
      gasLimit: '0xea60',
      speed: undefined,
      gasPrice: '0x3b9aca00',
      validUntil: undefined,
    });
  });

  it('sends a tx with fixed maxFeePerGas and maxPriorityFeePerGas', async () => {
    relayer.sendTransaction.mockResolvedValue(tx);

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });
    const request = pick(tx, 'to', 'data', 'value', 'gasLimit', 'maxFeePerGas', 'maxPriorityFeePerGas');
    const sent = await signer.sendTransaction(request);

    expect(relayer.sendTransaction).toHaveBeenCalledWith({
      ...request,
      gasLimit: '0xea60',
      speed: undefined,
      maxFeePerGas: '0x02540be400',
      maxPriorityFeePerGas: '0x3b9aca00',
      validUntil: undefined,
    });
  });

  it('replaces a tx by nonce', async () => {
    relayer.replaceTransactionByNonce.mockResolvedValue(tx);

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });
    const request = pick(tx, 'to', 'data', 'value', 'gasLimit', 'nonce');
    const sent = await signer.sendTransaction(request);

    expect(relayer.replaceTransactionByNonce).toHaveBeenCalledWith(30, {
      ...omit(request, 'nonce'),
      gasLimit: '0xea60',
      speed: tx.speed,
      gasPrice: undefined,
      validUntil: undefined,
    });
  });

  it('sends a contract tx', async () => {
    relayer.sendTransaction.mockResolvedValue(tx);
    provider.estimateGas.mockResolvedValueOnce(BigInt('0xea60'));
    provider.getCode.mockResolvedValueOnce('0x010203');

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });
    const contract = new Contract(tx.to, transferAbi, signer as ContractRunner);
    const sent = await contract.transfer?.(from, '0x02');

    expect(relayer.sendTransaction).toHaveBeenCalledWith({
      data: contract.interface.encodeFunctionData('transfer', [from, '0x02']),
      gasLimit: '0xea60',
      speed: 'safeLow',
      to: tx.to,
      value: undefined,
      gasPrice: undefined,
      validUntil: undefined,
    });
  });

  it('replaces a contract tx', async () => {
    relayer.replaceTransactionByNonce.mockResolvedValue(tx);
    provider.estimateGas.mockResolvedValueOnce(BigInt('0xea60'));
    provider.getCode.mockResolvedValueOnce('0x010203');

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });
    const contract = new Contract(tx.to, transferAbi, signer as ContractRunner);
    const sent = await contract.transfer?.(from, '0x02', { nonce: tx.nonce });

    expect(relayer.replaceTransactionByNonce).toHaveBeenCalledWith(30, {
      data: contract.interface.encodeFunctionData('transfer', [from, '0x02']),
      gasLimit: '0xea60',
      speed: 'safeLow',
      to: tx.to,
      value: undefined,
      gasPrice: undefined,
      validUntil: undefined,
    });
  });

  it('signs typed data', async () => {
    const domain = {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    };

    const types = {
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallet', type: 'address' },
      ],
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person' },
        { name: 'contents', type: 'string' },
      ],
    };

    const value = {
      from: {
        name: 'Cow',
        wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
        name: 'Bob',
        wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
    };

    const typedDataEncoder = mock<TypedDataEncoder>();
    const hashDomainSpy = jest.spyOn(TypedDataEncoder, 'hashDomain').mockReturnValue(hexlify(randomBytes(32)));
    const fromSpy = jest.spyOn(TypedDataEncoder, 'from').mockReturnValue(typedDataEncoder);
    const hashSpy = jest.spyOn(typedDataEncoder, 'hash').mockReturnValue(hexlify(randomBytes(32)));

    const signatureResponse = {
      r: '0xd1556332df97e3bd911068651cfad6f975a30381f4ff3a55df7ab3512c78b9ec',
      s: '0x66b51cbb10cd1b2a09aaff137d9f6d4255bf73cb7702b666ebd5af502ffa4410',
      v: 28,
      sig: '0xdead',
    };

    relayer.signTypedData.mockResolvedValue(signatureResponse);

    const signer = new DefenderRelaySigner(relayer, provider, from, { speed: 'safeLow' });

    const signature = await signer._signTypedData(domain, types, value);

    expect(hashDomainSpy).toHaveBeenCalledWith(domain);
    expect(fromSpy).toHaveBeenCalledWith(types);
    expect(hashSpy).toHaveBeenCalledWith(value);
    expect(signature).toEqual(Signature.from(signatureResponse).serialized);
  });
});
