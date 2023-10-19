require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  // List Account Usage
  const usage = await client.account.getUsage();

  console.log(usage);
}

if (require.main === module) {
  main().catch(console.error);
}
