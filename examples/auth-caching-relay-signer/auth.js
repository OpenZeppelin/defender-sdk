require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const fs = require('fs');

async function main() {
  const creds = {
    relayerApiKey: process.env.RELAYER_API_KEY,
    relayerApiSecret: process.env.RELAYER_API_SECRET,
  };
  const client = new Defender(creds);

  const relayerApiKey = client.relaySigner.getApiKey();
  const accessToken = await client.relaySigner.getAccessToken();

  // writes session.json with apiKey and accessToken
  fs.writeFileSync('session.json', JSON.stringify({ relayerApiKey, accessToken }, null, 2));

  console.log('Done! ✅');
}

if (require.main === module) {
  main().catch(console.error);
}
