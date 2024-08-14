import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import { ApiRelayerParams, IRelayer, RelayerGetResponse, RelayerStatus } from '../models/relayer';
import {
  ListTransactionsRequest,
  PaginatedTransactionResponse,
  RelayerTransaction,
  RelayerTransactionPayload,
  TransactionIntentDeleteResponse,
} from '../models/transactions';
import { JsonRpcResponse, SignMessagePayload, SignTypedDataPayload, SignedMessagePayload } from '../models/rpc';
import { AuthType } from '@openzeppelin/defender-sdk-base-client/lib/api/auth-v2';

export const getAdminApiUrl = () => process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';

export const getRelaySignerApiUrl = () => process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';

export class RelaySignerClient extends BaseApiClient implements IRelayer {
  private jsonRpcRequestNextId: number;

  public constructor(params: ApiRelayerParams) {
    super(params);
    this.jsonRpcRequestNextId = 1;
  }

  protected getPoolId(): string {
    return process.env.DEFENDER_RELAY_SIGNER_POOL_ID || 'us-west-2_iLmIggsiy';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_RELAY_SIGNER_POOL_CLIENT_ID || '1bpd19lcr33qvg5cr3oi79rdap';
  }

  protected getApiUrl(type?: AuthType): string {
    return getAdminApiUrl();
  }

  public async getRelayer(): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return (await api.get('/relayers/self')) as RelayerGetResponse;
    });
  }

  public async getRelayerStatus(): Promise<RelayerStatus> {
    return this.apiCall(async (api) => {
      return (await api.get('/relayers/self/status')) as RelayerStatus;
    });
  }

  public async sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.post('/relayers/self/txs', payload)) as RelayerTransaction;
    });
  }

  public async replaceTransactionById(id: string, payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.put(`/relayers/self/txs/${id}`, payload)) as RelayerTransaction;
    });
  }

  public async replaceTransactionByNonce(
    nonce: number,
    payload: RelayerTransactionPayload,
  ): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.put(`/relayers/self/txs/${nonce}`, payload)) as RelayerTransaction;
    });
  }

  public async cancelTransactionIntentById(id: string): Promise<TransactionIntentDeleteResponse> {
    return this.apiCall(async (api) => {
      return (await api.delete(`/relayers/self/txs/${id}`)) as TransactionIntentDeleteResponse;
    });
  }

  public async signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload> {
    return this.apiCall(async (api) => {
      return (await api.post('/relayers/self/sign-typed-data', payload)) as SignedMessagePayload;
    });
  }

  public async sign(payload: SignMessagePayload): Promise<SignedMessagePayload> {
    return this.apiCall(async (api) => {
      return (await api.post('/relayers/self/sign', payload)) as SignedMessagePayload;
    });
  }

  public async getTransaction(id: string): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.get(`/relayers/self/txs/${id}`)) as RelayerTransaction;
    });
  }

  public async listTransactions(criteria?: ListTransactionsRequest): Promise<PaginatedTransactionResponse> {
    return this.apiCall(async (api) => {
      return (await api.get(`/relayers/self/txs`, {
        params: { ...criteria, usePagination: true },
      })) as PaginatedTransactionResponse;
    });
  }

  public async call({ method, params }: { method: string; params: string[] }): Promise<JsonRpcResponse> {
    return this.apiCall(async (api) => {
      return (await api.post(`/relayers/self/jsonrpc`, {
        method,
        params,
        jsonrpc: '2.0',
        id: this.jsonRpcRequestNextId++,
      })) as JsonRpcResponse;
    });
  }
}
