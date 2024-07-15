require('dotenv').config();

const { createModularAccountAlchemyClient } = require('@alchemy/aa-alchemy');
const { sepolia } = require('@alchemy/aa-core');
const { DefenderRelay } = require('@openzeppelin/smart-account-signers');

const apiKey = process.env.ALCHEMY_API_KEY;
const defender = {
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_API_SECRET,
  relayerAddress: process.env.RELAYER_ADDRESS,
};

const signer = new DefenderRelay.AccountKitSigner(
  {
    apiKey: defender.apiKey,
    apiSecret: defender.apiSecret,
  },
  defender.relayerAddress,
);

async function main() {
  const smartAccountClient = await createModularAccountAlchemyClient({
    apiKey,
    chain: sepolia,
    signer,
  });

  const uo = await smartAccountClient.sendUserOperation({
    uo: {
      target: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // vitalik.eth
      data: '0x1234',
    },
  });

  const txHash = await smartAccountClient.waitForUserOperationTransaction(uo);

  console.log(txHash);
}

if (require.main === module) {
  main().catch(console.error);
}
