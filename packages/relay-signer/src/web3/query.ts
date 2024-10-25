import { JsonRpcRequest, JsonRpcResponseWithResult } from 'web3';
import { Relayer } from '../relayer';
import { RelayerParams } from '../models/relayer';
import { isRelayer } from '../ethers/utils';

export class DefenderRelayQueryProvider {
  protected relayer: Relayer;
  protected id = 1;

  constructor(relayerCredentials: RelayerParams | Relayer) {
    this.relayer = isRelayer(relayerCredentials) ? relayerCredentials : new Relayer(relayerCredentials);
  }

  private toJsonRpcResponse = <T>(payload: any): JsonRpcResponseWithResult<T> => ({
    jsonrpc: '2.0',
    id: payload.id ?? this.id++,
    result: payload.result,
  });

  public async request<T>(payload: JsonRpcRequest<string[]>): Promise<JsonRpcResponseWithResult<T>> {
    return this.relayer.call({ method: payload.method, params: payload.params ?? [] }).then(this.toJsonRpcResponse<T>);
  }
}
