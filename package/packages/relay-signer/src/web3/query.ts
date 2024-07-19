import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import { Relayer } from '../relayer';
import { RelayerParams } from '../models/relayer';
import { isRelayer } from '../ethers/utils';

type Web3Callback = (error: Error | null, result?: JsonRpcResponse) => void;

export class DefenderRelayQueryProvider {
  protected relayer: Relayer;
  protected id = 1;

  constructor(relayerCredentials: RelayerParams | Relayer) {
    this.relayer = isRelayer(relayerCredentials) ? relayerCredentials : new Relayer(relayerCredentials);
  }
  public sendAsync(payload: JsonRpcPayload, callback: Web3Callback): void {
    return this.send(payload, callback);
  }

  public send(payload: JsonRpcPayload, callback: Web3Callback): void {
    const payloadId = typeof payload.id === 'string' ? parseInt(payload.id) : payload.id;
    this.relayer
      .call({ method: payload.method, params: payload.params ?? [] })
      .then((response) =>
        callback(null, {
          ...response,
          id: payloadId ?? response.id ?? this.id++,
        }),
      )
      .catch((err) => callback(err, undefined));
  }
}
