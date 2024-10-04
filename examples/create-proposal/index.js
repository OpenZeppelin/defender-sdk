require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');
const https = require('https');

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  const proposal = await client.proposal.create({
    proposal: {
      contract: {
        address: '0x63966e9D09bf401106c515E71A426A160ee5C771',
        network: 'sepolia',
      },
      title: 'Set number',
      description: 'Set value to 42',
      type: 'custom',
      functionInterface: { name: 'setNumber', inputs: [{ name: 'value', type: 'uint256' }] },
      functionInputs: ['42'],
      via: '0xA285339861363492ed1dC276b0399eA1fC184E10',
      viaType: 'Safe',
    },
  });

  console.log(proposal);
}

if (require.main === module) {
  main().catch(console.error);
}
