import { ActionRelayerParams } from '@openzeppelin/defender-sdk-relay-signer-client';
import { DefenderOptions } from '.';
import { ClientParams } from './types';

export function isRelaySignerOptions(options: DefenderOptions): boolean {
  return (
    options.relayerApiKey !== undefined ||
    options.relayerApiSecret !== undefined ||
    options.credentials !== undefined ||
    options.relayerARN !== undefined
  );
}

export function isActionRelayerCredentials(credentials: Partial<ClientParams> | ActionRelayerParams): boolean {
  return 'credentials' in credentials && 'relayerARN' in credentials;
}

export function isApiCredentials(credentials: Partial<ClientParams> | ActionRelayerParams): boolean {
  return 'apiKey' in credentials && ('accessToken' in credentials || 'apiSecret' in credentials);
}

export function isActionKVStoreCredentials(credentials: Partial<ClientParams> | ActionRelayerParams): boolean {
  return 'credentials' in credentials && 'kvstoreARN' in credentials;
}
