require('dotenv').config();

const { Platform } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Platform(creds);

  const myAction = {
    name: 'my-action',
    encodedZippedCode: await client.action.getEncodedZippedCodeFromFolder({ path: './code' }),
    trigger: {
      type: 'schedule',
      frequencyMinutes: 1500,
    },
    paused: false,
  };

  const createdAction = await client.action.create(myAction);
  console.log(createdAction);
}

if (require.main === module) {
  main().catch(console.error);
}
