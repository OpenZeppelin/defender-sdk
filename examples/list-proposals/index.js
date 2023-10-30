require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  const proposals = await client.proposal.list({
    limit: 10,
    next: undefined,
  });

  console.log(proposals);
}

if (require.main === module) {
  main().catch(console.error);
}
