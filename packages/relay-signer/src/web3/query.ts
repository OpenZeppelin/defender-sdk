import { EthExecutionAPI, JsonRpcRequest, JsonRpcResponseWithResult, SimpleProvider } from 'web3';
import { Relayer } from '../relayer';
import { RelayerParams } from '../models/relayer';
import { isRelayer } from '../ethers/utils';

export class DefenderRelayQueryProvider implements SimpleProvider<EthExecutionAPI> {
  protected relayer: Relayer;
  protected id = 1;

  constructor(relayerCredentials: RelayerParams | Relayer) {
    this.relayer = isRelayer(relayerCredentials) ? relayerCredentials : new Relayer(relayerCredentials);
  }

  public async request<T>(payload: JsonRpcRequest<string[]>): Promise<JsonRpcResponseWithResult<T>> {
    const toJsonRpcResponse = (result: any): JsonRpcResponseWithResult<T> => ({
      jsonrpc: '2.0',
      id: result.id ?? this.id++,
      result: result.result,
    });
    return this.relayer.call({ method: payload.method, params: payload.params ?? [] }).then(toJsonRpcResponse);
  }
}
