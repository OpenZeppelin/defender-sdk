require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  // List Defender Supported Networks
  const networks = await client.network.listSupportedNetworks({ networkType: 'production' });
  // List Tenant Forked Networks
  const forkedNetworks = await client.network.list();

  console.log(networks);
  console.log(forkedNetworks);
}

if (require.main === module) {
  main().catch(console.error);
}
