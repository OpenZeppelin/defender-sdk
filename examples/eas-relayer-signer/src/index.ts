import { EAS, NO_EXPIRATION, SchemaEncoder, TransactionSigner } from '@ethereum-attestation-service/eas-sdk';

import dotenv from 'dotenv';
dotenv.config();
import { Agent } from 'node:https';
import { env } from 'node:process';

import { Defender, DefenderOptions } from '@openzeppelin/defender-sdk';
import { TypeDataSigner } from '@ethereum-attestation-service/eas-sdk/dist/offchain/typed-data-handler.js';

export const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'; // Sepolia v0.26

const creds = {
  relayerApiKey: env.RELAYER_API_KEY,
  relayerApiSecret: env.RELAYER_API_SECRET,
  //optional https config to keep connection alive. You can pass any configs that are accepted by https.Agent
  httpsAgent: new Agent({ keepAlive: true }),
};

const validForSeconds = 60 * 60 * 24;
const client = new Defender(creds as DefenderOptions);
const provider = client.relaySigner.getProvider({ ethersVersion: 'v6' });
const signer = await client.relaySigner.getSigner(provider, {
  speed: 'fast',
  validForSeconds,
  ethersVersion: 'v6',
});

// Initialize EAS with the EAS contract address on whichever chain where your schema is defined
const eas = new EAS(EASContractAddress);
eas.connect(provider as unknown as TransactionSigner);

const offchain = await eas.getOffchain();

// Initialize SchemaEncoder with the schema string
// Note these values are sample values and should be filled with actual values
// Code samples can be found when viewing each schema on easscan.org
const schemaEncoder = new SchemaEncoder('uint256 eventId, uint8 voteIndex');
const encodedData = schemaEncoder.encodeData([
  { name: 'eventId', value: 1, type: 'uint256' },
  { name: 'voteIndex', value: 1, type: 'uint8' },
]);

const offchainAttestation = await offchain.signOffchainAttestation(
  {
    recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
    expirationTime: NO_EXPIRATION, // Unix timestamp of when attestation expires (0 for no expiration)
    time: BigInt(Math.floor(Date.now() / 1000)), // Unix timestamp of current time
    revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    schema: '0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995',
    refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
    data: encodedData,
  },
  signer as TypeDataSigner,
);

console.log(offchainAttestation);
