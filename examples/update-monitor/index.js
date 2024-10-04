/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const abi = require('./abis/erc721.json');
const { Defender } = require('@openzeppelin/defender-sdk');
const https = require('https');

async function ensureNotificationChannelExists(client) {
  // use an existing notification channel
  const notificationChannels = await client.monitor.listNotificationChannels();
  if (notificationChannels.length > 0) {
    // Select your desired notification channel
    return notificationChannels[0];
  } else {
    // OR create a new notification channel
    return await client.monitor.createNotificationChannel({
      type: 'email',
      name: 'MyEmailNotification',
      config: {
        emails: ['john@example.com'],
      },
      paused: false,
    });
  }
}

async function main() {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
    httpsAgent: https.Agent({ keepAlive: true }),
  };
  const client = new Defender(creds);

  const notification = await ensureNotificationChannelExists(client);

  const blockRequestParameters = {
    type: 'BLOCK', // BLOCK or FORTA
    network: 'sepolia',
    // optional
    confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
    name: 'My Monitor',
    addresses: ['0x0f06aB75c7DD497981b75CD82F6566e3a5CAd8f2'],
    abi: JSON.stringify(abi),
    // optional
    paused: false,
    eventConditions: [
      {
        eventSignature: 'OwnershipTransferred(address,address)',
        expression: 'previousOwner=0x0f06aB75c7DD497981b75CD82F6566e3a5CAd8f2',
      },
      { eventSignature: 'Transfer(address,address,uint256)' },
    ],
    functionConditions: [{ functionSignature: 'renounceOwnership()' }],
    // optional
    txCondition: 'gasPrice > 0',
    // optional
    actionCondition: '3dcfee82-f5bd-43e3-8480-0676e5c28964',
    // optional
    actionTrigger: undefined,
    // optional
    alertThreshold: {
      amount: 2,
      windowSeconds: 3600,
    },
    // optional
    alertTimeoutMs: 0,
    notificationChannels: [notification.notificationId],
    // optional (LOW, MEDIUM, HIGH)
    severityLevel: 'MEDIUM',
    // optional
    riskCategory: 'TECHNICAL',
  };

  const created = await client.monitor.create(blockRequestParameters);

  console.log('created monitor id', created.monitorId);

  const updated = await client.monitor.update(created.monitorId, {
    // updates monitor name
    name: 'Monitor name updated!',
    // removes notification channels
    notificationChannels: [],
  });

  console.log('new name:', updated.name);
}

if (require.main === module) {
  main().catch(console.error);
}
