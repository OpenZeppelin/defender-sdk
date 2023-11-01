require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  // Gather actionId and api key
  const actionId = process.argv[2];
  if (!actionId) throw new Error(`ActionId missing`);

  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  if (!apiKey || !apiSecret) throw new Error(`Team API Key missing`);

  // Setup client
  const client = new Defender({ apiKey, apiSecret });

  // Update Variables
  const variables = await client.action.updateEnvironmentVariables(actionId, {
    variables: { hello: 'world!', test: '123' },
  });
  console.log(variables);
}

if (require.main === module) {
  main().catch(console.error);
}
