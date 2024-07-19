import { ActionRelayerParams, IRelayer, RelayerGetResponse, RelayerStatus } from '../models/relayer';
import { ListTransactionsRequest, RelayerTransaction, RelayerTransactionPayload } from '../models/transactions';
import {
  JsonRpcRequest,
  JsonRpcResponse,
  SignMessagePayload,
  SignTypedDataPayload,
  SignedMessagePayload,
} from '../models/rpc';
import { BaseActionClient } from '@openzeppelin/defender-sdk-base-client/lib/action';

export type SendTxRequest = {
  action: 'send-tx';
  payload: RelayerTransactionPayload;
};

export type GetTxRequest = {
  action: 'get-tx';
  payload: string;
};

export type SignRequest = {
  action: 'sign';
  payload: SignMessagePayload;
};

export type GetSelfRequest = {
  action: 'get-self';
};

export type JsonRpcCallRequest = {
  action: 'json-rpc-query';
  payload: JsonRpcRequest;
};

export type Request = SendTxRequest | GetTxRequest | SignRequest | GetSelfRequest | JsonRpcCallRequest;

export class ActionRelayer extends BaseActionClient implements IRelayer {
  private jsonRpcRequestNextId: number;

  public constructor(params: ActionRelayerParams) {
    super(params.credentials, params.relayerARN);
    this.jsonRpcRequestNextId = 0;
  }

  public async sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    return this.execute({ action: 'send-tx', payload });
  }

  public async replaceTransactionById(id: string, payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    const txPayload: RelayerTransactionPayload & { id: string } = { ...payload, id };
    return this.execute({ action: 'replace-tx', txPayload });
  }

  public async replaceTransactionByNonce(
    nonce: number,
    payload: RelayerTransactionPayload,
  ): Promise<RelayerTransaction> {
    const txPayload: RelayerTransactionPayload & { nonce: number } = { ...payload, nonce };
    return this.execute({ action: 'replace-tx', payload });
  }

  public async getRelayer(): Promise<RelayerGetResponse> {
    return this.execute({
      action: 'get-self' as const,
    });
  }

  public async getRelayerStatus(): Promise<RelayerStatus> {
    return this.execute({
      action: 'get-self-status' as const,
    });
  }

  public async getTransaction(id: string): Promise<RelayerTransaction> {
    return this.execute({
      action: 'get-tx' as const,
      payload: id,
    });
  }

  public async listTransactions(criteria?: ListTransactionsRequest): Promise<RelayerTransaction[]> {
    return this.execute({
      action: 'list-txs' as const,
      payload: criteria ?? {},
    });
  }

  public async sign(payload: SignMessagePayload): Promise<SignedMessagePayload> {
    return this.execute({
      action: 'sign' as const,
      payload: payload,
    });
  }

  public async signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload> {
    return this.execute({
      action: 'signTypedData' as const,
      payload: payload,
    });
  }

  public async call({ method, params }: { method: string; params: string[] }): Promise<JsonRpcResponse> {
    return this.execute({
      action: 'json-rpc-query' as const,
      payload: { method, params, jsonrpc: '2.0', id: this.jsonRpcRequestNextId++ },
    });
  }
}
