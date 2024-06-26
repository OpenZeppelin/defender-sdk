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
    firstHash: req.events[0].hash,
    signature: req.signature,
  });

  res.json({ message: valid ? 'valid signature' : 'invalid signature' });
}

function main() {
  // example webhook payload
  const req = {
    events: [
      {
        hash: '0x1dc91b98249fa9f2c5c37486a2427a3a7825be240c1c84961dfb3063d9c04d50',
      },
    ],
    signature: '0b9e477b432546d9ec2e026d1a2e81ac92dd822a871ceff3300f1ac04c5863bd',
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
