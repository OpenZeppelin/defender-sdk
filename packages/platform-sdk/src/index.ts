import { MonitorClient } from "@openzeppelin/platform-sdk-monitor-client";
import { ActionClient } from "@openzeppelin/platform-sdk-action-client";
import { RelayClient } from "@openzeppelin/platform-sdk-relay-client";
import { ProposalClient } from "@openzeppelin/platform-sdk-proposal-client";
import { DeployClient } from "@openzeppelin/platform-sdk-deploy-client";
import { NotificationChannelClient } from "@openzeppelin/platform-sdk-notification-channel-client";
import { RelaySignerClient } from "@openzeppelin/platform-sdk-relay-signer-client";
import { Newable, ClientParams } from "./types";

interface PlatformOptions {
    apiKey?: string;
    apiSecret?: string;
    relayerApiKey?: string;
    relayerApiSecret?: string;
}

function getClient<T>(Client: Newable<T>, credentials: Partial<ClientParams>): T {
    if(!credentials.apiKey || !credentials.apiSecret) throw new Error(`API key and secret are required`);
    return new Client(credentials);
};

export class Platform {
    private apiKey: string | undefined;
    private apiSecret: string | undefined;
    private relayerApiKey: string | undefined;
    private relayerApiSecret: string | undefined;

    constructor(options: PlatformOptions) {
        this.apiKey = options.apiKey;
        this.apiSecret = options.apiSecret;
        this.relayerApiKey = options.relayerApiKey;
        this.relayerApiSecret = options.relayerApiSecret;
    }

    get monitor() {
        return getClient(MonitorClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }

    get action() {
        return getClient(ActionClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }

    get relay() {
        return getClient(RelayClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }

    get proposal() {
        return getClient(ProposalClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }

    get deploy() {
        return getClient(DeployClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }

    get notifiationChannel() {
        return getClient(NotificationChannelClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }

    get relaySigner() {
        return getClient(RelaySignerClient, {apiKey: this.relayerApiKey, apiSecret: this.relayerApiSecret});
    }
}