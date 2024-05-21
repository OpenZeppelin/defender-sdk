/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const abi = require('./abis/erc721.json');
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

  let notification;
  // use an existing notification channel
  const notificationChannels = await client.monitor.listNotificationChannels();
  if (notificationChannels.length > 0) {
    // Select your desired notification channel
    notification = notificationChannels[0];
  } else {
    // OR create a new notification channel
    notification = await client.monitor.createNotificationChannel({
      type: 'email',
      name: 'MyEmailNotification',
      config: {
        emails: ['john@example.com'],
      },
      paused: false,
    });
  }

  const blockRequestParameters = {
    type: 'BLOCK', // BLOCK or FORTA
    network: 'sepolia',
    // optional
    confirmLevel: 1, // if not set, we pick the blockwatcher for the chosen network with the lowest offset
    name: 'MyNewMonitor',
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
    severityLevel: 'LOW',
    // optional
    riskCategory: 'TECHNICAL',
  };

  const fortaRequestParameters = {
    type: 'FORTA', // BLOCK or FORTA
    name: 'MyNewFortaMonitor',
    // optional
    addresses: ['0x0f06aB75c7DD497981b75CD82F6566e3a5CAd8f2'],
    // optional
    agentIDs: ['0x8fe07f1a4d33b30be2387293f052c273660c829e9a6965cf7e8d485bcb871083'],
    fortaConditions: {
      // optional
      alertIDs: undefined, // string[]
      minimumScannerCount: 1, // default is 1
      // optional
      severity: 2, // (unknown=0, info=1, low=2, medium=3, high=4, critical=5)
    },
    // optional
    paused: false,
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
  };

  // call create with the request parameters
  const monitorResponse = await client.monitor.create(blockRequestParameters); // or fortaRequestParameters

  console.log(monitorResponse);
}

if (require.main === module) {
  main().catch(console.error);
}
