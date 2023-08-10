require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  const currentRelayer = await client.relay.get({ relayerId: 'e65451f5-0f76-4961-8d29-33504319c5f8' });

  console.log(currentRelayer);

  const updatedRelayer = await client.relay.update({
    relayerId: currentRelayer.relayerId,
    relayerUpdateParams: { name: 'Test 2' },
  });

  console.log(updatedRelayer);
}

if (require.main === module) {
  main().catch(console.error);
}
