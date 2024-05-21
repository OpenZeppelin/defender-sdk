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

  const proposals = await client.proposal.list({
    limit: 10,
    next: undefined,
  });

  console.log(proposals);
}

if (require.main === module) {
  main().catch(console.error);
}
