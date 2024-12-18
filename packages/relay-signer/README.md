# Defender SDK Relay Signer Client

Defender Relay Signer Client lets you send transactions to any supported network using private relayers. Each relayer has its own secure private key, and a set of API keys. You can send transactions via your relayers by POSTing to the Defender HTTP API, or using this library.

## Install

```bash
npm install @openzeppelin/defender-sdk-relay-signer-client
# or
yarn add @openzeppelin/defender-sdk-relay-signer-client

```

This library also includes an [ethers.js](https://docs.ethers.io/v5/) signer and a [web3.js](https://web3js.readthedocs.io/) provider, that uses the Relay to sign and broadcast its transactions.

### Usage

Start by creating a new relayer using either the Defender console or API for a network of your choice. Write down the API key and secret. Then use them to create a new `Relayer` instance in your code:

```js
import { Relayer } from '@openzeppelin/defender-sdk-relay-signer-client';
const relayer = new Relayer({ apiKey: API_KEY, apiSecret: API_SECRET });
```

And use the relayer instance to send a transaction:

```js
const tx = await relayer.sendTransaction({
  to: '0x6b175474e89094c44da98b954eedeac495271d0f',
  value: '0x16345785d8a0000',
  data: '0x5af3107a',
  speed: 'fast',
  gasLimit: 100000,
});
```

The `sendTransaction` call returns once the transaction has been _signed_ by the relayer. To monitor the transaction status, see [Querying](#Querying) below.

#### Speed

Instead of the usual `gasPrice` or `maxFeePerGas`/`maxPriorityFeePerGas`, the Relayer may also accept a `speed` parameter that can be one of `safeLow`, `average`, `fast`, or `fastest`. These values are mapped to actual gas prices when the transaction is sent or resubmitted and vary depending on the state of the network.

If `speed` is provided, the transaction would be priced according to the `EIP1559Pricing` relayer policy.

NOTE: Mainnet gas prices and priority fees are calculated based on the values reported by [EthGasStation](https://ethgasstation.info/), [EtherChain](https://etherchain.org/tools/gasPriceOracle), [GasNow](https://www.gasnow.org/), [BlockNative](https://docs.blocknative.com/gas-platform), and [Etherscan](https://etherscan.io/gastracker). In Polygon and its testnet, the [gas station](https://gasstation-mainnet.matic.network/v2) is used. In other networks, gas prices are obtained from a call to `eth_gasPrice` or `eth_feeHistory` to the network.

#### Return data

The returned transaction object `tx` will have the following shape:

```ts
interface RelayerTransactionBase {
  transactionId: string; // Defender transaction identifier
  hash: string; // Ethereum transaction hash
  to: string;
  from: string;
  value?: string;
  data?: string;
  speed: 'safeLow' | 'average' | 'fast' | 'fastest';
  gasLimit: number;
  nonce: number;
  status: 'pending' | 'sent' | 'submitted' | 'inmempool' | 'mined' | 'confirmed' | 'failed';
  chainId: number;
  validUntil: string;
}
```

### Querying transactions

The `relayer` object also has a `getTransaction` function that returns a transaction object as described above. This method receives the `transactionId`, **not** the transaction `hash`:

```js
const latestTx = await relayer.getTransaction(tx.transactionId);
```

Transaction can be queried by nonce as well:

```js
const latestTx = await relayer.getTransactionByNonce(tx.nonce);
```

Alternatively, the `relayer` can also be used to `list` the latest transactions sent, optionally filtering by status and creation time.

```js
const since = await relayer.list({
  since: new Date(Date.now() - 60 * 1000),
  status: 'pending', // can be 'pending', 'mined', or 'failed'
  limit: 5,
  usePagination: true,
  sort: 'desc', // available only in combination with pagination
  next: '', // optional: include when the response has this value to fetch the next set of results
});
```

The `list` function now accepts several parameters to facilitate pagination, such as limit, usePagination, sort, and next. The sort parameter is available only when pagination is enabled, and the next parameter is optional, used to fetch the next set of results when included in the response.

When using pagination by setting `usePagination` to `true`, the format of the response will be different from the default.
The response will be an object containing two properties: `items` and `next`. The items property is an array of `RelayerTransaction` objects, representing the fetched list of transactions. The next property is an optional string. If present, it can be used as the value for the next parameter in a subsequent request to retrieve the next set of transactions.

```js
{ items: RelayerTransaction[]; next?: string }
```

Defender will update the transaction `status` every minute, marking it as `confirmed` after 12 confirmations. The transaction information will be stored for 30 days.

#### Why querying?

The `getTransaction` and `getTransactionByNonce` functions are important to monitor the transaction status, since Defender may choose to _resubmit the transaction with a different gas price_, effectively changing its hash. This means that, if you monitor your transaction only via `getTransactionReceipt(tx.hash)` calls to a node, you may not get the latest info if it was replaced.

Defender may replace a transaction by increasing its gas price if it has not been mined for a period of time, and the gas price costs have increased since the transaction was originally submitted. Also, in a case where a transaction consistently fails to be mined, Defender may replace it by a _no-op_ (a transaction with no value or data) in order to advance the sender account nonce.

### Relayer Status

To gain better insight into the current status of a relayer, you can use the `getRelayerStatus` method. This method provides real-time information about a relayer, such as its nonce, transaction quota, and the number of pending transactions.

To get the current status of a relayer:

```js
const status = await relayer.getRelayerStatus('58b3d255-e357-4b0d-aa16-e86f745e63b9');
```

The response will be of the shape:

```js
export interface RelayerStatus {
  relayerId: string; // Unique identifier for the relayer
  name: string; // Name of the relayer
  nonce: number; // Current relayer nonce
  address: string; // Address of the relayer
  numberOfPendingTransactions: number; // Number of transactions: pending|sent|submitted|inmempool
  paused: boolean; // If the relayer is paused or not
  pendingTxCost?: string; // The total cost of all pending transactions, if available
  txsQuotaUsage: number; // Used transaction quota for the relayer
  rpcQuotaUsage: number; // Used RPC quota for the relayer
  lastConfirmedTransaction?: {
    // Details of the last confirmed transaction
    hash: string,
    status: string,
    minedAt: string,
    sentAt: string,
    nonce: number,
  };
}
```

This method can be particularly helpful in monitoring and managing your relayer resources more effectively.

### Replacing transactions

You can use the relayer methods `replaceTransactionById` or `replaceTransactionByNonce` to replace a transaction given its nonce or transactionId (not hash) if it has not been mined yet. You can use this to increase the speed of a transaction, or replace your tx by an empty value transfer (with a gas limit of 21000) to cancel a transaction that is no longer valid.

```js
// Cancel a transaction with nonce 42 by sending a zero-value transfer to replace it
const tx = await relayer.replaceTransactionByNonce(42, {
  to: '0x6b175474e89094c44da98b954eedeac495271d0f',
  value: '0x00',
  data: '0x',
  speed: 'fastest',
  gasLimit: 21000,
});
```

You can also replace by nonce using the `ethers.js` and `web3.js` adapters listed below.

### Signing

You can sign any hex string (`0x123213`) according to the [EIP-191 Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191) (prefixed by `\x19Ethereum Signed Message:\n`) using a `sign` method of the relayer. Pay attention, that the message has to be a **hex string**.

```js
const signResponse = await relayer.sign({ message: msg });
```

Also, you can sign typed data according to the [EIP-712 Specification](https://eips.ethereum.org/EIPS/eip-712) using a `signTypedData` method of the relayer by providing both the `domainSeparator` and the `hashStruct(message)` as parameters. Heads up that both are hashes so they should be 32-bytes long.

```js
const signTypedDataResponse = await relayer.signTypedData({
  domainSeparator,
  hashStructMessage,
});
```

#### Return data

Once your data is signed, the following response will be returned:

```js
export interface SignedMessagePayload {
  sig: Hex;
  r: Hex;
  s: Hex;
  v: number;
}
```

### Network calls

You can also use Defender for making arbitrary JSON RPC calls to the network via the `call` method. All JSON RPC methods are supported, except for event filters and websocket subscriptions.

```js
const balance = await relayer.call('eth_getBalance', ['0x6b175474e89094c44da98b954eedeac495271d0f', 'latest']);
```

### Ethers.js

You can use the `defender-relay-client` with [ethers.js v5](https://github.com/ethers-io/ethers.js/) directly. The package exports a `DefenderRelaySigner` [signer](https://docs.ethers.io/v5/api/signer/) that is used to send transactions, and a `DefenderRelayProvider` [provider](https://docs.ethers.io/v5/api/providers/) that is used to make calls to the network through Defender.

Make sure to have `ethers` installed in your project, and initialize a new defender signer instance like:

```js
const { DefenderRelayProvider, DefenderRelaySigner } = require('@openzeppelin/defender-sdk-relay-signer-client/ethers');
const { ethers } = require('ethers');

const credentials = { apiKey: API_KEY, apiSecret: API_SECRET };
const provider = new DefenderRelayProvider(credentials);
const signer = new DefenderRelaySigner(credentials, provider, { speed: 'fast' });
```

You can then use it to send any transactions, such as executing a contract function. The `tx` object returned will be a regular ethers.js `TransactionResponse` object, with the addition of Defender's `transactionId` field.

```js
const erc20 = new ethers.Contract(ERC20_ADDRESS, ERC20_ABI, signer);
const tx = await erc20.functions.transfer(beneficiary, (1e18).toString());
const mined = await tx.wait();
```

The `signMessage` method is supported as well, allowing to sign an arbitrary data with a relayer key.

```js
const signed = await signer.signMessage('Funds are safu!');
```

The `_signTypedData` method is also supported to sign [EIP712](https://eips.ethereum.org/EIPS/eip-712) messages

```js
const signedEIP712Message = await signer._signTypedData(domain, types, value);
```

#### Limitations

The current implementation of the `DefenderRelaySigner` for ethers.js has the following limitations:

- Due to validations set up in `ethers.js`, it is not possible to specify the transaction `speed` for an individual transaction when sending it. It must be set during the signer construction, and will be used for all transactions sent through it.
- A `wait` on the transaction to be mined will only wait for the current transaction hash (see [Querying](#Querying)). If Defender Relayer replaces the transaction with a different one, this operation will time out. This is ok for fast transactions, since Defender only reprices after a few minutes. But if you expect the transaction to take a long time to be mined, then ethers' `wait` may not work. Future versions will also include an ethers provider aware of this.

### Web3.js

You can also use the `@openzeppelin/defender-sdk-relay-signer-client` with [web3.js](https://web3js.readthedocs.io/) via a `DefenderRelayProvider` which routes all JSON RPC calls through Defender, and uses a Relayer for signing and broadcasting transactions.

```js
const { DefenderRelayProvider } = require('@openzeppelin/defender-sdk-relay-signer-client/web3');
const Web3 = require('web3');

const credentials = { apiKey: API_KEY, apiSecret: API_SECRET };
const provider = new DefenderRelayProvider(credentials, { speed: 'fast' });
const web3 = new Web3(provider);
```

You can then use the `web3` instance to query and send transactions as you would normally do:

```js
const [from] = await web3.eth.getAccounts();
const erc20 = new web3.eth.Contract(ERC20_ABI, ERC20_ADDRESS, { from });
const tx = await erc20.methods.transfer(beneficiary, (1e18).toString()).send();
```

You can also sign messages using the Relayer key via the `sign` method:

```js
const signature = await web3.eth.sign('0xdead', from);
```

The package also includes two composable lower-level providers, the `DefenderRelaySenderProvider` and `DefenderRelayQueryProvider`. The former intercepts all `sendTransaction` methods and serves them via the Relayer, while the latter uses Defender's JSON RPC interface for all method calls. The `DefenderRelayProvider` shown above combines the two.

Note that these web3.js providers currently have the same limitations as the ethers.js one described above.

### Using in Actions

[Defender Actions](https://docs.openzeppelin.com/defender/module/actions) natively support integration with Defender Relay, allowing to send transactions without providing API keys. In your actions's code, just `require('defender-sdk')` and construct a new relayer instance using the `credentials` object injected by the action. This will give you a relayer object already configured.

```js
const { Defender } = require('@openzeppelin/defender-sdk');

exports.handler = async function (credentials) {
  const client = new Defender(credentials);

  const txRes = await client.relaySigner.sendTransaction({
    to: '0xc7464dbcA260A8faF033460622B23467Df5AEA42',
    value: 100,
    speed: 'fast',
    gasLimit: '21000',
  });

  console.log(txRes);
  return txRes.hash;
};
```

## FAQ

**Can I use this package in a browser?**

This package is not designed to be used in a browser environment. Using this package requires sensitive API KEYS that should not be exposed publicly.
