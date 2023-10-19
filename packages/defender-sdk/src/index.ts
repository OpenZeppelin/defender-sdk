import { MonitorClient } from '@openzeppelin/defender-sdk-monitor-client';
import { ActionClient } from '@openzeppelin/defender-sdk-action-client';
import { RelayClient } from '@openzeppelin/defender-sdk-relay-client';
import { ProposalClient } from '@openzeppelin/defender-sdk-proposal-client';
import { DeployClient } from '@openzeppelin/defender-sdk-deploy-client';
import { NotificationChannelClient } from '@openzeppelin/defender-sdk-notification-channel-client';
import { NetworkClient } from '@openzeppelin/defender-sdk-network-client';
import { AccountClient } from '@openzeppelin/defender-sdk-account-client';

import { Newable, ClientParams } from './types';
import { ActionRelayerParams, Relayer as RelaySignerClient } from '@openzeppelin/defender-sdk-relay-signer-client';
import { ListNetworkRequestOptions } from '@openzeppelin/defender-sdk-network-client/lib/models/networks';
import { Network } from '@openzeppelin/defender-sdk-base-client';

interface DefenderOptions {
  apiKey?: string;
  apiSecret?: string;
  relayerApiKey?: string;
  relayerApiSecret?: string;
  credentials?: ActionRelayerParams;
  relayerARN?: string;
}

function getClient<T>(Client: Newable<T>, credentials: Partial<ClientParams> | ActionRelayerParams): T {
  if (
    !('credentials' in credentials && 'relayerARN' in credentials) &&
    !('apiKey' in credentials && 'apiSecret' in credentials)
  ) {
    throw new Error(`API key and secret are required`);
  }

  return new Client(credentials);
}

export class Defender {
  private apiKey: string | undefined;
  private apiSecret: string | undefined;
  private relayerApiKey: string | undefined;
  private relayerApiSecret: string | undefined;
  private actionCredentials: ActionRelayerParams | undefined;
  private actionRelayerArn: string | undefined;

  constructor(options: DefenderOptions) {
    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret;
    this.relayerApiKey = options.relayerApiKey;
    this.relayerApiSecret = options.relayerApiSecret;
    // support for using relaySigner from Defender Actions
    this.actionCredentials = options.credentials;
    this.actionRelayerArn = options.relayerARN;
  }

  public networks(opts?: ListNetworkRequestOptions): Promise<Network[]> {
    return getClient(NetworkClient, { apiKey: this.apiKey, apiSecret: this.apiSecret }).listSupportedNetworks(opts);
  }

  get network() {
    return getClient(NetworkClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get account() {
    return getClient(AccountClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get monitor() {
    return getClient(MonitorClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get action() {
    return getClient(ActionClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get relay() {
    return getClient(RelayClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get proposal() {
    return getClient(ProposalClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get deploy() {
    return getClient(DeployClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get notificationChannel() {
    return getClient(NotificationChannelClient, { apiKey: this.apiKey, apiSecret: this.apiSecret });
  }

  get relaySigner() {
    return getClient(RelaySignerClient, {
      ...(this.actionCredentials ? { credentials: this.actionCredentials } : undefined),
      ...(this.actionRelayerArn ? { relayerARN: this.actionRelayerArn } : undefined),
      ...(this.relayerApiKey ? { apiKey: this.relayerApiKey } : undefined),
      ...(this.relayerApiSecret ? { apiSecret: this.relayerApiSecret } : undefined),
    });
  }
}
