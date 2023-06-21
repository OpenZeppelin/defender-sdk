require('dotenv').config();

const { Platform } = require('@openzeppelin/platform-sdk');

async function main() {
  const creds = { apiKey: process.env.API_KEY, apiSecret: process.env.API_SECRET };
  const client = new Platform(creds);

  const createParams = {
    name: 'MyNewRelayer',
    network: 'goerli',
    minBalance: BigInt(1e17).toString(),
    policies: {
      whitelistReceivers: ['0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'],
    },
  };

  const relayer = await client.relay.create({ relayer: createParams });

  console.log(relayer);
}

if (require.main === module) {
  main().catch(console.error);
}
