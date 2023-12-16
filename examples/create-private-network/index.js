require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  // Create Private Network
  const network = await client.network.createForkedNetwork({
    name: 'MyPrivateNetwork',
    rpcUrl: '', // Add your RPC URL here
    configuration: {
      symbol: 'ETH',
    },
  });

  console.log(network);
}

if (require.main === module) {
  main().catch(console.error);
}
