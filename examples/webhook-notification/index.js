require('dotenv').config();
const { Defender } = require('@openzeppelin/defender-sdk');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '9b07149008666eef75a1262af0fb8c4b';

function webhook(req, res) {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  };
  const client = new Defender(creds);

  const valid = client.notificationChannel.verifySignature({
    secret: WEBHOOK_SECRET,
    signature: req.signature,
    timestamp: req.timestamp,
    validityInMs: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years (defaults to 10 minutes)
  });

  res.json({ message: valid ? 'valid signature' : 'invalid signature' });
}

function main() {
  // example webhook payload
  const req = {
    events: [],
    timestamp: '2024-07-04T17:02:40.364Z',
    signature: 'b20d0784b9d82f61fd22ce4fc1ae486b213b3d8d9e24e0ad2e9194d95bca1ece',
  };
  const res = { json: console.log };
  webhook(req, res);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error);
  }
}
