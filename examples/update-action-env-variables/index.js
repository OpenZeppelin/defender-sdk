require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const https = require('https');

async function main() {
  // Gather actionId and api key
  const actionId = process.argv[2];
  if (!actionId) throw new Error(`ActionId missing`);

  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  if (!apiKey || !apiSecret) throw new Error(`Team API Key missing`);

  // Setup client
  const client = new Defender({
    apiKey,
    apiSecret,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  });

  // Get Variables
  const currentVariables = await client.action.getEnvironmentVariables(actionId);
  console.log('current environment variables', currentVariables);

  // Update Variables
  const variables = await client.action.updateEnvironmentVariables(actionId, {
    variables: { hello: 'world!', test: '123' },
  });
  console.log('updated environment variables', variables);
}

if (require.main === module) {
  main().catch(console.error);
}
