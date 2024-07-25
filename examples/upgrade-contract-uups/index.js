require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

const uupsOwnableAbi = require('./abis/UUPSOwnable.json');

async function main() {
  const client = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });

  // Get approval process for deployment on Sepolia
  const config = await client.deploy.getUpgradeApprovalProcess('sepolia');
  console.log(config);

  const upgrade = await client.deploy.upgradeContract({
    proxyAddress: '0x3a...d7',
    newImplementationAddress: '0x48...99',
    newImplementationABI: JSON.stringify(uupsOwnableAbi),
    network: 'sepolia',
  });

  console.log(upgrade);
}

if (require.main === module) {
  main().catch(console.error);
}
