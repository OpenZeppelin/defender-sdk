require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  // Create Forked Network
  const network = await client.network.createForkedNetwork({
    name: 'MyForkedNetwork',
    forkedNetwork: 'mainnet',
    rpcUrl: '', // Add your RPC URL here
  })

  console.log(network);
}

if (require.main === module) {
  main().catch(console.error);
}
