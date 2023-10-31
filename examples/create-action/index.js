require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  client.action.validatePath('./code');
  const encodedZippedCode = await client.action.getEncodedZippedCodeFromFolder('./code');

  const myAction = {
    name: 'my-action',
    encodedZippedCode,
    trigger: {
      type: 'schedule',
      frequencyMinutes: 1500,
    },
    paused: false,
    environmentVariables: {
      hello: 'world!',
    },
  };

  const createdAction = await client.action.create(myAction);
  console.log(createdAction);
}

if (require.main === module) {
  main().catch(console.error);
}
