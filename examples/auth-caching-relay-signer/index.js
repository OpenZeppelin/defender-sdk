require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const fs = require('fs');

async function main() {
  let cachedCredentials = {};

  try {
    cachedCredentials = JSON.parse(fs.readFileSync('session.json'));
  } catch (e) {
    console.error('❌ No credentials found. Please run "auth" command first.');
    return;
  }

  try {
    const client = new Defender(cachedCredentials);
    const info = await client.relaySigner.getRelayerStatus();
    console.log('relayerStatus', JSON.stringify(info, null, 2));
  } catch (e) {
    if (e.response?.status === 401) {
      console.error('❌ Access token expired. Please run "auth" command again.');
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}
