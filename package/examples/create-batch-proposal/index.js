require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const https = require('https');

const ERC20Token = '0x24B5C627cF54582F93eDbcF6186989227400Ac75';
const RolesContract = '0xa50d145697530e8fef3F59a9643c6E9992d0f30D';

const contracts = [
  {
    address: ERC20Token,
    name: 'ERC20 Token',
    network: 'sepolia',
    abi: '[{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]',
  },
  {
    address: RolesContract,
    network: 'sepolia',
    name: 'Roles Contract',
    abi: '[{"inputs":[{"internalType":"bytes32","name":"role","type":"bytes32"},{"internalType":"address","name":"account","type":"address"}],"name":"grantRole","outputs":[],"stateMutability":"nonpayable","type":"function"}]',
  },
];

const safeAddress = '0xba4A8019166BB0E066dF2De99b37fbd5916eCf20';

const steps = [
  {
    contractId: `sepolia-${ERC20Token}`,
    targetFunction: {
      name: 'mint',
      inputs: [{ type: 'uint256', name: 'amount' }],
    },
    functionInputs: ['999'],
    type: 'custom',
  },
  {
    contractId: `sepolia-${ERC20Token}`,
    targetFunction: {
      name: 'transfer',
      inputs: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'amount' },
      ],
    },
    functionInputs: [safeAddress, '999'],
    type: 'custom',
  },
  {
    contractId: `sepolia-${RolesContract}`,
    metadata: {
      action: 'grantRole',
      role: '0x0000000000000000000000000000000000000000000000000000000000000000',
      account: safeAddress,
    },
    type: 'access-control',
  },
];

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  const { url } = await client.proposal.create({
    proposal: {
      contract: contracts,
      title: 'Batch test',
      description: 'Mint, transfer and modify access control',
      type: 'batch',
      via: safeAddress,
      viaType: 'Safe',
      metadata: {}, // Required field but empty
      steps,
    },
  });

  console.log(url);
}

if (require.main === module) {
  main().catch(console.error);
}
