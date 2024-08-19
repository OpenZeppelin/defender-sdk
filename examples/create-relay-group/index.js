require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const https = require('https');

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  const createParams = {
    name: 'MyNewGroupRelayer',
    network: 'sepolia',
    relayers: 2,
    minBalance: BigInt(1e17).toString(),
    policies: {
      EIP1559Pricing: true,
    },
  };

  const relayerGroup = await client.relayGroup.createKey('c66b2ca3-5334-40fa-845a-74af36790773');

  console.log(relayerGroup);
}

if (require.main === module) {
  main().catch(console.error);
}
