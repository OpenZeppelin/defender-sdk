import { isEmpty } from 'lodash';
import { BaseApiClient, Network } from '@openzeppelin/defender-sdk-base-client';
import {
  ApprovalProcessResponse,
  BlockExplorerApiKeyResponse,
  CreateBlockExplorerApiKeyRequest,
  DeployContractRequest,
  DeploymentResponse,
  RemoveBlockExplorerApiKeyResponse,
  UpdateBlockExplorerApiKeyRequest,
  UpgradeContractRequest,
  UpgradeContractResponse,
} from '../models';
import { Verification, VerificationRequest } from '../models/verification';
import { extractArtifact } from '../utils/deploy';

const DEPLOYMENTS_PATH = '/deployments';
const UPGRADES_PATH = '/upgrades';
const BLOCKEXPLORER_API_KEY_PATH = '/block-explorer-api-key';

export class DeployClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL || 'https://defender-api.openzeppelin.com/v2/';
  }

  public async deployContract(params: DeployContractRequest): Promise<DeploymentResponse> {
    if (isEmpty(params.artifactUri) && isEmpty(params.artifactPayload))
      throw new Error(
        `Missing artifact in deploy request. Either artifactPayload or artifactUri must be included in the request.`,
      );

    if (params.artifactPayload) {
      params.artifactPayload = JSON.stringify(extractArtifact(params));
    }

    return this.apiCall(async (api) => {
      return api.post(`${DEPLOYMENTS_PATH}`, params);
    });
  }

  public async getDeployedContract(id: string): Promise<DeploymentResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_PATH}/${id}`);
    });
  }

  public async listDeployments(): Promise<DeploymentResponse[]> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_PATH}`);
    });
  }

  public async getDeployApprovalProcess(network: Network): Promise<ApprovalProcessResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_PATH}/config/${network}`);
    });
  }

  public async upgradeContract(params: UpgradeContractRequest): Promise<UpgradeContractResponse> {
    return this.apiCall(async (api) => {
      return api.post(`${UPGRADES_PATH}`, params);
    });
  }

  public async getUpgradeApprovalProcess(network: Network): Promise<ApprovalProcessResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${UPGRADES_PATH}/config/${network}`);
    });
  }

  public async getBlockExplorerApiKey(blockExplorerApiKeyId: string): Promise<BlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${BLOCKEXPLORER_API_KEY_PATH}/${blockExplorerApiKeyId}`);
    });
  }
  public async listBlockExplorerApiKeys(): Promise<BlockExplorerApiKeyResponse[]> {
    return this.apiCall(async (api) => {
      return api.get(`${BLOCKEXPLORER_API_KEY_PATH}`);
    });
  }

  public async createBlockExplorerApiKey(
    params: CreateBlockExplorerApiKeyRequest,
  ): Promise<BlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.post(`${BLOCKEXPLORER_API_KEY_PATH}`, params);
    });
  }

  public async updateBlockExplorerApiKey(
    blockExplorerApiKeyId: string,
    params: UpdateBlockExplorerApiKeyRequest,
  ): Promise<BlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.put(`${BLOCKEXPLORER_API_KEY_PATH}/${blockExplorerApiKeyId}`, params);
    });
  }

  public async removeBlockExplorerApiKey(blockExplorerApiKeyId: string): Promise<RemoveBlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.delete(`${BLOCKEXPLORER_API_KEY_PATH}/${blockExplorerApiKeyId}`);
    });
  }

  public async getDeploymentVerification(
    contractNetwork: Pick<VerificationRequest, 'contractNetwork'>,
    contractAddress: Pick<VerificationRequest, 'contractAddress'>,
  ): Promise<Verification | undefined> {
    return this.apiCall(async (api) => {
      try {
        return (await api.get(`/verifications/${contractNetwork}/${contractAddress}`)) as Verification;
      } catch {
        return undefined;
      }
    });
  }
}
