require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const { AbiCoder } = require('ethers');
const https = require('https');

const artifactFile = require('./artifacts/Box.json');

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  // await client.deploy.createBlockExplorerApiKey({
  //   network: 'sepolia',
  //   key: process.env.BLOCKEXPLORER_API_KEY,
  // });

  const keys = await client.deploy.listBlockExplorerApiKeys();
  console.log(keys);

  // Get approval process for deployment on sepolia
  const config = await client.deploy.getDeployApprovalProcess('sepolia');
  console.log(config);

  const deployment = await client.deploy.deployContract({
    contractName: 'Box',
    contractPath: 'contracts/Box.sol',
    network: 'sepolia',
    artifactPayload: JSON.stringify(artifactFile),
    licenseType: 'MIT',
    verifySourceCode: true,
    constructorBytecode: AbiCoder.defaultAbiCoder().encode(['uint'], ['5']), // or constructorInputs: [5],
  });

  const deploymentStatus = await client.deploy.getDeployedContract(deployment.deploymentId);
  console.log(deploymentStatus);
}

if (require.main === module) {
  main().catch(console.error);
}
