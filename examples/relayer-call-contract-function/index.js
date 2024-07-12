require('dotenv').config();

const { ethers, version } = require('ethers');
const BoxAbi = require('./box.json');
const { Defender } = require('@openzeppelin/defender-sdk');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const creds = {
    relayerApiKey: process.env.RELAYER_API_KEY,
    relayerApiSecret: process.env.RELAYER_API_SECRET,
  };
  const validUntil = new Date(Date.now() + 120 * 1000).toISOString();

  const client = new Defender(creds);
  console.log('using ethers version ', version);

  const provider = client.relaySigner.getProvider({ ethersVersion: 'v6' });
  const signer = await client.relaySigner.getSigner(provider, { speed: 'fast', validUntil, ethersVersion: 'v6' });

  const contractAddress = '0x1B9ec5Cc45977927fe6707f2A02F51e1415f2052';
  const contract = new ethers.Contract(contractAddress, BoxAbi, signer);

  console.log(`Calling store function`);
  const result = await contract.store('10');

  console.log(`Transaction sent:`, result.hash);
  console.log(`Status:`, result.status);

  // polls until the transaction is mined.
  let recipt = null;
  while (recipt == null) {
    recipt = await provider.getTransactionReceipt(result.hash);
    console.log('sleep 1s before requesting again');
    await sleep(1000);
  }
  console.log(recipt);
}

if (require.main === module) {
  main().catch(console.error);
}
