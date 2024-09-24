/**
 * Example showcasing a webhook implementation for receiving Defender notifications such as
 * Relayer transactions statuses or Monitor alerts.
 *
 * webhook() function represents the webhook endpoint that will receive the Defender notifications.
 *
 * Defender sends a POST request to the webhook with a Defender-Timestamp and Defender-Signature
 * headers containing a HMAC signature of the request body. The webhook should verify the signature
 * using the shared WEBHOOK_SECRET.
 */

require('dotenv').config();
const { Defender } = require('@openzeppelin/defender-sdk');
const ReqBody = require('./body.json');

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'c7ad9ef4276dac354cb51d3aa9b1e4c7';

function webhook(req, res) {
  const creds = {
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  };
  const client = new Defender(creds);

  const signature = req.headers['Defender-Signature'];
  const timestamp = req.headers['Defender-Timestamp'];

  const result = client.notificationChannel.verifySignature({
    body: req.body,
    signature,
    timestamp,
    secret: WEBHOOK_SECRET,
    validityInMs: 1000 * 60 * 10, // 10 minutes
  });

  res.json({ message: result.valid ? 'Valid signature' : result.error });
}

function main() {
  // example webhook payload
  const req = {
    headers: {
      'Defender-Signature': '92decfe61224c1e9dd8f69afaa715a51223022734b58726c05b3cf7318039844',
      'Defender-Timestamp': '2024-07-05T15:01:29.115Z',
    },
    body: ReqBody,
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
