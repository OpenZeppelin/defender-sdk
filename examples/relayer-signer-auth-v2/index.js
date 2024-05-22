require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const client = new Defender({
    relayerApiKey: process.env.RELAYER_API_KEY,
    relayerApiSecret: process.env.RELAYER_API_SECRET,
    useCredentialsCaching: true,
  });

  const status = await client.relaySigner.getRelayerStatus();

  console.log(status);
}

if (require.main === module) {
  main().catch(console.error);
}
