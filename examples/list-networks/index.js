require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  const networks = await client.networks({ networkType: 'production' });
  console.log(networks);
}

if (require.main === module) {
  main().catch(console.error);
}
