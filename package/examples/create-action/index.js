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
