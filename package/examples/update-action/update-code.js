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

  // Get new code digest
  const encodedZippedCode = await client.action.getEncodedZippedCodeFromFolder('./code');
  const newDigest = client.action.getCodeDigest({ encodedZippedCode });

  // Get existing one
  const { codeDigest } = await client.action.get(actionId);

  // Update code only if changed
  if (newDigest === codeDigest) {
    console.log(`Code digest matches (skipping upload)`);
  } else {
    await client.action.updateCodeFromFolder(actionId, { path: './code' });
    console.log(`Action code updated`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
