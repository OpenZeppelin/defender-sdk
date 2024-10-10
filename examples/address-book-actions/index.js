require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function main() {
  const client = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  });

  const addresses = await client.addressBook.list();
  console.log('addresses:', addresses);

  const created = await client.addressBook.create({
    address: '0x1A8943463a20f55B8BC7a318dB77C4AEDBC3fae6',
    name: 'My EOA Address',
    network: 'sepolia',
    type: 'EOA',
    alias: 'Deployer EOA address',
  });
  console.log('created address:', created);

  const deleteRes = await client.addressBook.delete(created.addressBookId);
  console.log(deleteRes);
}

if (require.main === module) {
  main().catch(console.error);
}
