require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  const contracts = await client.proposal.listContracts({ includeAbi: false });

  if (contracts.length > 0) {
    const firstContractId = `${contracts[0].network}-${contracts[0].address}`;
    const first = await client.proposal.getContract(firstContractId);
    console.log('first contract:', first);
  }

  console.log(contracts);
}

if (require.main === module) {
  main().catch(console.error);
}
