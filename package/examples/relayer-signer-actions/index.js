require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

const creds = {
  relayerApiKey: process.env.RELAYER_API_KEY,
  relayerApiSecret: process.env.RELAYER_API_SECRET,
};
const client = new Defender(creds);

async function get() {
  const info = await client.relaySigner.getRelayer();
  console.log('relayerInfo', JSON.stringify(info, null, 2));
}

async function status() {
  const info = await client.relaySigner.getRelayerStatus();
  console.log('relayerStatus', JSON.stringify(info, null, 2));
}

async function send() {
  const txResponse = await client.relaySigner.sendTransaction({
    to: '0x179810822f56b0e79469189741a3fa5f2f9a7631',
    value: 1,
    speed: 'fast',
    gasLimit: '21000',
  });
  console.log('txResponse', JSON.stringify(txResponse, null, 2));
}

async function replace(id) {
  const txResponse = await client.relaySigner.replaceTransactionById(id, {
    to: '0x179810822f56b0e79469189741a3fa5f2f9a7631',
    value: 2,
    speed: 'fast',
    gasLimit: '21000',
  });
  console.log('txResponse', JSON.stringify(txResponse, null, 2));
}

async function sign(msg) {
  if (!msg) throw new Error(`Missing msg to sign`);
  const signResponse = await client.relaySigner.sign({ message: msg });
  console.log('signResponse', signResponse);
}

async function query(id) {
  if (!id) throw new Error(`Missing id`);
  const txUpdate = await client.relaySigner.getTransaction(id);
  console.log('txUpdate', txUpdate);
}

async function list() {
  const transactions = await client.relaySigner.listTransactions({
    limit: 20,
    status: 'mined',
    sort: 'desc', // optional, only available in combination with usePagination
    next: '', // optional: include when the response has this value to fetch the next set of results
  });
  console.log(JSON.stringify(transactions, null, 2));
}

async function balance(addr) {
  if (!addr) throw new Error(`Missing address`);
  const balance = await client.relaySigner.call({ method: 'eth_getBalance', params: [addr, 'latest'] });
  console.log(`eth_getBalance`, JSON.stringify(balance, null, 2));
}

async function jsonrpc(method, payload) {
  if (!method) throw new Error(`Missing method`);
  if (!payload) throw new Error(`Missing payload`);
  const result = await client.relaySigner.call({ method, params: JSON.parse(payload) });
  console.log(method, JSON.stringify(result, null, 2));
}

async function main() {
  try {
    const action = process.argv[2];
    if (!action) {
      console.error(`Usage: node index.js query|get|status|list|send|sign|balance`);
      process.exit(1);
    }
    switch (action) {
      case 'query':
        return await query(process.argv[3]);
      case 'get':
        return await get();
      case 'status':
        return await status();
      case 'send':
        return await send();
      case 'replace':
        return await replace(process.argv[3]);
      case 'sign':
        return await sign(process.argv[3]);
      case 'balance':
        return await balance(process.argv[3]);
      case 'list':
        return await list();
      case 'jsonrpc':
        return await jsonrpc(process.argv[3], process.argv[4]);
      default:
        console.error(`Unknown action ${process.argv[2]}, valid actions: query|get|list|send|sign|balance`);
        process.exit(1);
    }
  } catch (e) {
    console.log(`Unexpected error:`, e);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
