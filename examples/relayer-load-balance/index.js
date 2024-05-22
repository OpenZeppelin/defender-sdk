require('dotenv').config();

const { Defender } = require('@openzeppelin/defender-sdk');

async function loadbalance() {
  const LOAD_BALANCE_THRESHOLD = 50;
  const relayerCredsForMainNet = [
    {
      relayerApiKey: process.env.RELAYER_API_KEY_1,
      relayerApiSecret: process.env.RELAYER_API_SECRET_1,
    },
    {
      relayerApiKey: process.env.RELAYER_API_KEY_2,
      relayerApiSecret: process.env.RELAYER_API_SECRET_2,
    },
  ];
  const relayerClientsForMainNet = relayerCredsForMainNet.map((creds) => new Defender(creds));

  const getNextAvailableRelayer = async () => {
    for (const client of relayerClientsForMainNet) {
      const relayerStatus = await client.relaySigner.getRelayerStatus();
      if (relayerStatus.numberOfPendingTransactions < LOAD_BALANCE_THRESHOLD) {
        console.log(
          `${relayerStatus.name} (${relayerStatus.relayerId}) can handle ${
            LOAD_BALANCE_THRESHOLD - relayerStatus.numberOfPendingTransactions
          } more transactions.`,
        );
        return client;
      }
      console.warn(
        `${relayerStatus.name} (${relayerStatus.relayerId}) is at full capacity with ${relayerStatus.numberOfPendingTransactions}/${LOAD_BALANCE_THRESHOLD} pending transactions.`,
      );
    }
    return undefined;
  };

  const executeTransaction = async () => {
    const client = await getNextAvailableRelayer();
    if (!client) throw new Error('Unable to load balance. All relayers are operating above the suggested threshold.');

    const txResponse = await client.relaySigner.sendTransaction({
      to: '0x179810822f56b0e79469189741a3fa5f2f9a7631',
      value: 1,
      speed: 'fast',
      gasLimit: '21000',
    });
    console.log('txResponse', JSON.stringify(txResponse, null, 2));
  };

  await executeTransaction();
}

async function main() {
  try {
    return await loadbalance();
  } catch (e) {
    console.log(`Unexpected error:`, e);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}
