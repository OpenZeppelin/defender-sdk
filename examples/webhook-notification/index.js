require('dotenv').config();
const { Defender } = require('@openzeppelin/defender-sdk');

const WEBHOOK_SECRET = 'ece309aa-bb4c-4dd5-995d-ad35e83f9924';

function webhook(req, res) {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  };
  const client = new Defender(creds);

  const valid = client.notificationChannel.verifySignature({
    secret: WEBHOOK_SECRET,
    signature: req.signature,
  });

  res.json({ message: valid ? 'valid signature' : 'invalid signature' });
}

function main() {
  // example webhook payload
  const req = {
    events: [],
    signature: '0d85d9d705054c179e4a33290da3d44e7a32368d0a6d771785fa4b683e905338',
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
