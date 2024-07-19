require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  // Create Private Network
  const network = await client.network.createPrivateNetwork({
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
