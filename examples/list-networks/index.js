require('dotenv').config();

const { Platform } = require('@openzeppelin/platform-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Platform(creds);

  const networks = await client.networks('prod');
  console.log(networks);
}

if (require.main === module) {
  main().catch(console.error);
}
