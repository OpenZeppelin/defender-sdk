require('dotenv').config();

const { ethers } = require('ethers');
const { Defender } = require('@openzeppelin/defender-sdk');

const artifactFile = require('./artifacts/Box.json');

async function main() {
  const client = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });

  if (!process.env.EOA_PRIVATE_KEY) {
    throw new Error('Missing EOA_PRIVATE_KEY');
  }
  const signer = new ethers.Wallet(process.env.EOA_PRIVATE_KEY, new ethers.JsonRpcProvider('https://rpc.sepolia.org'));

  // 1. creates EOA approval process to deploy contracts.
  console.log('creating deployment environment...');
  const approvalProcess = await client.approvalProcess.create({
    name: 'EOA approval process',
    network: 'sepolia',
    via: signer.address,
    viaType: 'EOA',
    component: ['deploy'],
  });

  // 2. creates a contract deployment in defender.
  console.log('creating contract deployment...');
  const deployment = await client.deploy.deployContract({
    contractName: 'Box',
    contractPath: 'contracts/Box.sol',
    network: 'sepolia',
    artifactPayload: JSON.stringify(artifactFile),
    licenseType: 'MIT',
    constructorInputs: [5],
    approvalProcessId: approvalProcess.approvalProcessId,
    verifySourceCode: false,
  });

  // 3. Actually deploys the contract from external service.
  console.log('deploying contract...');
  const factory = new ethers.ContractFactory(
    artifactFile.output.contracts['contracts/Box.sol'].Box.abi,
    artifactFile.output.contracts['contracts/Box.sol'].Box.evm.bytecode.object,
    signer,
  );
  const ethersDeployment = await factory.deploy(5);
  const result = await ethersDeployment.deploymentTransaction().wait();

  // 4. updates the deployment status in defender.
  console.log('updating deployment in Defender...');
  await client.deploy.updateDeployment(deployment.deploymentId, {
    address: result.contractAddress,
    txHash: result.hash,
  });

  console.log('deployment was successfully updated in Defender');
}

if (require.main === module) {
  main().catch(console.error);
}
