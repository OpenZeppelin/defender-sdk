import { MonitorClient } from "@openzeppelin/platform-sdk-monitor-client";

interface PlatformOptions {
    apiKey?: string;
    apiSecret?: string;
    relayerApiKey?: string;
    relayerApiSecret?: string;
}

// TODO: improve client and return typing
function getClient(client: any, credentials: {apiKey: string | undefined; apiSecret: string | undefined}): any {
    if(!credentials.apiKey || !credentials.apiSecret) throw new Error(`API key and secret are required`);
    return new client(credentials);
};

export class Platform {
    private apiKey: string | undefined;
    private apiSecret: string | undefined;
    private relayerApiKey: string | undefined;
    private relayerApiSecret: string | undefined;

    // TODO: add relayerApiKey and relayerApiSecret when we add relay signer
    constructor(options: PlatformOptions) {
        this.apiKey = options.apiKey;
        this.apiSecret = options.apiSecret;
        this.relayerApiKey = options.relayerApiKey;
        this.relayerApiSecret = options.relayerApiSecret;
    }

    get monitor() {
        return getClient(MonitorClient, {apiKey: this.apiKey, apiSecret: this.apiSecret});
    }
}