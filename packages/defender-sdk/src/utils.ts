import { DefenderOptions } from '.';

export function isRelaySignerOptions(options: DefenderOptions): boolean {
  return (
    options.relayerApiKey !== undefined ||
    options.relayerApiSecret !== undefined ||
    options.credentials !== undefined ||
    options.relayerARN !== undefined
  );
}
