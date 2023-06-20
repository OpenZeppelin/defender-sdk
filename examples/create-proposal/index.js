require('dotenv').config();

const { Platform } = require('@openzeppelin/platform-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Platform(creds);

  const proposal = await client.proposal.create({
    proposal: {
      contract: {
        address: '0x76d1d77e2b571f332e1128bDd6640C68aa3d136d',
        network: 'goerli',
      },
      title: 'Set number',
      description: 'Set value to 42',
      type: 'custom',
      functionInterface: { name: 'setNumber', inputs: [{ name: 'value', type: 'uint256' }] },
      functionInputs: ['42'],
      via: '0x534Fba01B138915C9F6D2b58bCF5C4712852cfE8',
      viaType: 'Gnosis Safe',
    }
  });

  console.log(proposal.url);
}

if (require.main === module) {
  main().catch(console.error);
}
