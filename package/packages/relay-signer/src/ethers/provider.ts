import { EthersVersion, RelayerParams } from '../models/relayer';
import { DefenderRelaySigner } from './signer';
import { getRelaySignerApiUrl } from '../api';
import { Relayer } from '../relayer';
import {
  JsonRpcError,
  JsonRpcProvider,
  JsonRpcResult,
  Network,
  getBigInt,
  JsonRpcSigner,
  JsonRpcPayload,
} from 'ethers';

export type DefenderRelayProviderOptions = {
  ethersVersion: EthersVersion;
};

export class DefenderRelayProvider extends JsonRpcProvider {
  private relayer: Relayer;
  private pendingNetwork: Promise<Network> | null = null;

  constructor(readonly credentials: RelayerParams) {
    super(getRelaySignerApiUrl());
    this.relayer = new Relayer(credentials);
  }

  async _detectNetwork(): Promise<Network> {
    this.pendingNetwork = (async () => {
      let result: JsonRpcResult | JsonRpcError;
      try {
        result = await this.send('eth_chainId', []);
        this.pendingNetwork = null;
      } catch (error) {
        this.pendingNetwork = null;
        throw error;
      }

      this.emit('debug', { action: 'receiveRpcResult', result });

      if ((result && typeof result === 'string') || typeof result === 'number') {
        return Network.from(getBigInt(result));
      }

      if (result && 'result' in result) {
        return Network.from(getBigInt(result.result));
      }

      throw this.getRpcError({ id: 1, jsonrpc: '2.0', method: 'eth_chainId', params: [] }, result);
    })();

    return await this.pendingNetwork;
  }

  // Logic from JsonRpcProvider.detectNetwork
  async detectNetwork(): Promise<Network> {
    return this._detectNetwork();
  }

  async _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<JsonRpcResult[]> {
    if (Array.isArray(payload)) {
      return Promise.all(payload.map((p) => this.send(p.method, p.params as Array<any>)));
    }
    return [await this.send(payload.method, payload.params as Array<any>)];
  }

  async send(method: string, params: Array<any>): Promise<any> {
    const request = { method, params };
    this.emit('debug', { action: 'request', request, provider: this });
    try {
      const result = await this.relayer.call(request);
      this.emit('debug', { action: 'response', request, response: result, provider: this });
      if (result.error) {
        const error: any = new Error(result.error.message);
        error.code = result.error.code;
        error.data = result.error.data;
        throw error;
      }
      return result.result;
    } catch (error) {
      this.emit('debug', { action: 'response', error, request: request, provider: this });
      throw error;
    }
  }

  // Logic from JsonRpcProvider.getSigner
  async getSigner(address?: number | string): Promise<JsonRpcSigner> {
    if (typeof address === 'number') {
      throw new Error(
        'Invalid address: cannot provide an index number as address, only one relayer address is supported.',
      );
    }
    if (address) {
      return new DefenderRelaySigner(this.relayer, this, address, {}) as any as JsonRpcSigner;
    }
    const relayer = await this.relayer.getRelayer();
    return new DefenderRelaySigner(this.relayer, this, relayer.address, {}) as any as JsonRpcSigner;
  }
}
