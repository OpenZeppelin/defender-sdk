require('dotenv').config();
const { ENTRYPOINT_ADDRESS_V07, createSmartAccountClient } = require('permissionless');
const { signerToSafeSmartAccount } = require('permissionless/accounts');
const { createPimlicoBundlerClient, createPimlicoPaymasterClient } = require('permissionless/clients/pimlico');
const { createPublicClient, http } = require('viem');
const { sepolia } = require('viem/chains');
const { DefenderRelay } = require('@openzeppelin/smart-account-signers');

// REPLACE WITH YOUR OWN KEYS
const apiKey = process.env.PIMLICO_API_KEY;
const defender = {
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_API_SECRET,
  relayerAddress: process.env.RELAYER_ADDRESS,
};

const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

export const publicClient = createPublicClient({
  transport: http('https://rpc.ankr.com/eth_sepolia'),
});

export const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterUrl),
  entryPoint: ENTRYPOINT_ADDRESS_V07,
});

const signer = new DefenderRelay.PermissionlessSigner(
  {
    apiKey: defender.apiKey,
    apiSecret: defender.apiSecret,
  },
  defender.relayerAddress,
);

async function main() {
  const account = await signerToSafeSmartAccount(publicClient, {
    signer,
    entryPoint: ENTRYPOINT_ADDRESS_V07, // global entrypoint
    safeVersion: '1.4.1',
  });

  console.log(`Smart account address: https://sepolia.etherscan.io/address/${account.address}`);

  const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

  const bundlerClient = createPimlicoBundlerClient({
    transport: http(bundlerUrl),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
  });

  const smartAccountClient = createSmartAccountClient({
    account,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: sepolia,
    bundlerTransport: http(bundlerUrl),
    middleware: {
      gasPrice: async () => {
        return (await bundlerClient.getUserOperationGasPrice()).fast;
      },
      sponsorUserOperation: paymasterClient.sponsorUserOperation,
    },
  });

  const txHash = await smartAccountClient.sendTransaction({
    to: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // vitalik.eth
    value: 0n,
    data: '0x1234',
  });

  console.log(`User operation included: https://sepolia.etherscan.io/tx/${txHash}`);
}

if (require.main === module) {
  main().catch(console.error);
}
