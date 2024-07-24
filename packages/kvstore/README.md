# Defender Key-Value Store for Actions

The [Defender Actions](https://docs.openzeppelin.com/defender/v2/module/actions) service allows you to run small code snippets on a regular basis or via webhooks that can make calls to the Ethereum network or to external APIs. Thanks to tight integration to Defender Relayers, you can use Actions to automate regular operations on your contracts.

This client allows you to access a simple key-value data store from your Actions code, so you can persist data throughout executions and across different Actions.

_Note that this package will not work outisde the Actions environment._

## Installation

This package is included in the latest Actions runtime environment, so you do not need to bundle it in your code. To install it for local development and typescript type completion, run:

```bash
npm install @openzeppelin/defender-sdk-key-value-store
```

```bash
yarn add @openzeppelin/defender-sdk-key-value-store
```

## Usage

You can interact with your key-value store through an instance of `Defender`, which is initialized with the payload injected in the your Action `handler` function. Once initialized, you can call `kvstore.get`, `kvstore.put`, or `kvstore.del`.

```js
const { Defender } = require('@openzeppelin/defender-sdk');

exports.handler = async function (event) {
  // Creates an instance of the key-value store client
  const client = new Defender(event);

  // Associates myValue to myKey
  await client.keyValueStore.put('myKey', 'myValue');

  // Returns myValue associated to myKey
  const value = await client.keyValueStore.get('myKey');

  // Deletes the entry for myKey
  await client.keyValueStore.del('myKey');
};
```

## Local development

The Defender key-value store is only accessible from within an Action. To simplify local development, you can create an instance using `Defender.localKVStoreClient` providing an object with a `path` property. The client will use a local json file at that path for all operations.

```js
const { Defender } = require('@openzeppelin/defender-sdk');

async function local() {
  // Creates an instance of the client that will write to a local file
  const store = Defender.localKVStoreClient({ path: '/tmp/foo/store.json' });

  // The store.json file will contain { myKey: myValue }
  await store.put('myKey', 'myValue');
}
```

## Considerations

- All data in the key-value store is persisted as strings, both keys and values.
- Keys are limited to 1kb in size, and values to 300kb.
- The data store is shared across all your Actions; consider prefixing the keys with a namespace if you want to have different data buckets.
- A key-value entry is expired after 90 days of the last time it was `put` into the store.
- The total number of key-value records in your store is determined by your Defender plan.
