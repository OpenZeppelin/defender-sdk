require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

const boxAbiFile = require('./abis/Box.json');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  // Get approval process for deployment on Sepolia
  const config = await client.deploy.getUpgradeApprovalProcess('goerli');
  console.log(config);

  const upgrade = await client.deploy.upgradeContract({
    proxyAddress: '0xABC1234...',
    proxyAdminAddress: '0xDEF1234...',
    newImplementationABI: JSON.stringify(boxAbiFile),
    newImplementationAddress: '0xABCDEF1....',
    network: 'goerli',
  });

  console.log(upgrade);
}

if (require.main === module) {
  main().catch(console.error);
}
