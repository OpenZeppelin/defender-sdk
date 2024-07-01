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
    networks: ['sepolia'],
    relayers: 2,
    minBalance: BigInt(1e17).toString(),
    policies: {
      whitelistReceivers: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'],
      EIP1559Pricing: true,
    },
  };

  const relayerGroup = await client.relayGroup.create(createParams);

  console.log(relayerGroup);
}

if (require.main === module) {
  main().catch(console.error);
}
