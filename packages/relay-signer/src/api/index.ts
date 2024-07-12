import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import { ApiRelayerParams, IRelayer, RelayerGetResponse, RelayerStatus } from '../models/relayer';
import {
  ListTransactionsRequest,
  PaginatedTransactionResponse,
  RelayerTransaction,
  RelayerTransactionPayload,
} from '../models/transactions';
import { JsonRpcResponse, SignMessagePayload, SignTypedDataPayload, SignedMessagePayload } from '../models/rpc';
import { AuthType } from '@openzeppelin/defender-sdk-base-client/lib/api/auth-v2';

export const getRelaySignerApiUrl = () =>
  process.env.DEFENDER_RELAY_SIGNER_API_URL || 'https://api.defender.openzeppelin.com/';
export const getAdminApiUrl = () => process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';

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
    if (type === 'admin') return getAdminApiUrl();
    return getRelaySignerApiUrl();
  }

  public async getRelayer(): Promise<RelayerGetResponse> {
    return this.apiCall(async (api) => {
      return (await api.get('/relayer')) as RelayerGetResponse;
    });
  }

  public async getRelayerStatus(): Promise<RelayerStatus> {
    return this.apiCall(async (api) => {
      return (await api.get('/relayer/status')) as RelayerStatus;
    });
  }

  public async sendTransaction(payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.post('/txs', payload)) as RelayerTransaction;
    });
  }

  public async replaceTransactionById(id: string, payload: RelayerTransactionPayload): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.put(`/txs/${id}`, payload)) as RelayerTransaction;
    });
  }

  public async replaceTransactionByNonce(
    nonce: number,
    payload: RelayerTransactionPayload,
  ): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.put(`/txs/${nonce}`, payload)) as RelayerTransaction;
    });
  }

  public async signTypedData(payload: SignTypedDataPayload): Promise<SignedMessagePayload> {
    return this.apiCall(async (api) => {
      return (await api.post('/sign-typed-data', payload)) as SignedMessagePayload;
    });
  }

  public async sign(payload: SignMessagePayload): Promise<SignedMessagePayload> {
    return this.apiCall(async (api) => {
      return (await api.post('/sign', payload)) as SignedMessagePayload;
    });
  }

  public async getTransaction(id: string): Promise<RelayerTransaction> {
    return this.apiCall(async (api) => {
      return (await api.get(`txs/${id}`)) as RelayerTransaction;
    });
  }

  public async listTransactions(criteria?: ListTransactionsRequest): Promise<PaginatedTransactionResponse> {
    return this.apiCall(async (api) => {
      return (await api.get(`txs`, { params: { ...criteria, usePagination: true } })) as PaginatedTransactionResponse;
    });
  }

  public async call({ method, params }: { method: string; params: string[] }): Promise<JsonRpcResponse> {
    return this.apiCall(async (api) => {
      return (await api.post(`/relayer/jsonrpc`, {
        method,
        params,
        jsonrpc: '2.0',
        id: this.jsonRpcRequestNextId++,
      })) as JsonRpcResponse;
    });
  }
}
