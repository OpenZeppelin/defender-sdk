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
import { AuthConfig, Network, RetryConfig } from '@openzeppelin/defender-sdk-base-client';
import https from 'https';
import { isRelaySignerOptions } from './utils';

export interface DefenderOptions {
  apiKey?: string;
  apiSecret?: string;
  relayerApiKey?: string;
  relayerApiSecret?: string;
  credentials?: ActionRelayerParams;
  relayerARN?: string;
  httpsAgent?: https.Agent;
  retryConfig?: RetryConfig;
  useCredentialsCaching?: boolean;
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
  private httpsAgent?: https.Agent;
  private retryConfig?: RetryConfig;
  private authConfig?: AuthConfig;

  constructor(options: DefenderOptions) {
    this.apiKey = options.apiKey;
    this.apiSecret = options.apiSecret;
    this.relayerApiKey = options.relayerApiKey;
    this.relayerApiSecret = options.relayerApiSecret;
    // support for using relaySigner from Defender Actions
    this.actionCredentials = options.credentials;
    this.actionRelayerArn = options.relayerARN;
    this.httpsAgent = options.httpsAgent;
    this.retryConfig = options.retryConfig;
    this.authConfig = {
      useCredentialsCaching: options.useCredentialsCaching ?? true,
      type: isRelaySignerOptions(options) ? 'relay' : 'admin',
    };
  }

  public networks(opts?: ListNetworkRequestOptions): Promise<Network[]> {
    return getClient(NetworkClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    }).listSupportedNetworks(opts);
  }

  get network() {
    return getClient(NetworkClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get account() {
    return getClient(AccountClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get monitor() {
    return getClient(MonitorClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get action() {
    return getClient(ActionClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get relay() {
    return getClient(RelayClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get proposal() {
    return getClient(ProposalClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get deploy() {
    return getClient(DeployClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get notificationChannel() {
    return getClient(NotificationChannelClient, {
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
    });
  }

  get relaySigner() {
    return getClient(RelaySignerClient, {
      httpsAgent: this.httpsAgent,
      retryConfig: this.retryConfig,
      authConfig: this.authConfig,
      ...(this.actionCredentials ? { credentials: this.actionCredentials } : undefined),
      ...(this.actionRelayerArn ? { relayerARN: this.actionRelayerArn } : undefined),
      ...(this.relayerApiKey ? { apiKey: this.relayerApiKey } : undefined),
      ...(this.relayerApiSecret ? { apiSecret: this.relayerApiSecret } : undefined),
    });
  }
}
