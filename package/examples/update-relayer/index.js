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

  const currentRelayer = await client.relay.get('e65451f5-0f76-4961-8d29-33504319c5f8');

  console.log(currentRelayer);

  const updatedRelayer = await client.relay.update(currentRelayer.relayerId, { name: 'Test 2' });

  console.log(updatedRelayer);
}

if (require.main === module) {
  main().catch(console.error);
}
