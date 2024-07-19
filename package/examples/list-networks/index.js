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

  // List Defender Supported Networks
  const networks = await client.network.listSupportedNetworks({ networkType: 'production' });
  // List Tenant Forked Networks
  const forkedNetworks = await client.network.listForkedNetworks();

  console.log(networks);
  console.log(forkedNetworks);
}

if (require.main === module) {
  main().catch(console.error);
}
