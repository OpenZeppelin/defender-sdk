require('dotenv').config();

const { Platform } = require('@openzeppelin/platform-sdk');

async function main() {
  // Gather autotaskId and api key
  const actionId = process.argv[2];
  if (!actionId) throw new Error(`AutotaskId missing`);

  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  if (!apiKey || !apiSecret) throw new Error(`Team API Key missing`);

  // Setup client
  const client = new Platform({ apiKey, apiSecret });

  // Get new code digest
  const encodedZippedCode = await client.action.getEncodedZippedCodeFromFolder({ path: './code' });
  const newDigest = client.action.getCodeDigest({ encodedZippedCode });

  // Get existing one
  const { codeDigest } = await client.action.get({ actionId });

  // Update code only if changed
  if (newDigest === codeDigest) {
    console.log(`Code digest matches (skipping upload)`);
  } else {
    await client.action.updateCodeFromFolder({ actionId, path: './code' });
    console.log(`Autotask code updated`);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
