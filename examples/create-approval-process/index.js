require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Defender(creds);

  const relayers = await client.relay.list();
  let relayer = relayers.items.find((relayer) => relayer.network === 'sepolia');
  if (!relayer) {
    console.log('Relayer not found, creating one');
    relayer = await client.relay.create({ name: 'My Testnet Relayer', network: 'sepolia', minBalance: 0 });
  }

  const approvalProcess = await client.approvalProcess.create({
    name: 'My Approval Process',
    network: 'sepolia',
    relayerId: relayer.relayerId,
  });

  console.log(approvalProcess);
}

if (require.main === module) {
  main().catch(console.error);
}
