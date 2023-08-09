require('dotenv').config();

const { Platform } = require('@openzeppelin/defender-sdk');

const artifactFile = require('./artifacts/Box.json');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Platform(creds);

  // await client.deploy.createBlockExplorerApiKey({
  //   network: 'goerli',
  //   key: process.env.BLOCKEXPLORER_API_KEY,
  // });

  const keys = await client.deploy.listBlockExplorerApiKeys();
  console.log(keys);

  // Get approval process for deployment on sepolia
  const config = await client.deploy.getDeployApprovalProcess({ network: 'goerli' });
  console.log(config);

  const deployment = await client.deploy.deployContract({
    contractName: 'Box',
    contractPath: 'contracts/Box.sol',
    network: 'goerli',
    artifactPayload: JSON.stringify(artifactFile),
    licenseType: 'MIT',
    verifySourceCode: true,
  });

  const deploymentStatus = await client.deploy.getDeployedContract({ deploymentId: deployment.deploymentId });
  console.log(deploymentStatus);
}

if (require.main === module) {
  main().catch(console.error);
}
