import { isEmpty } from 'lodash';
import { BaseApiClient, Network } from '@openzeppelin/platform-sdk-base-client';
import {
  ApprovalProcessResponse,
  BlockExplorerApiKeyResponse,
  CreateBlockExplorerApiKeyRequest,
  DeployContractRequest,
  DeploymentConfigCreateRequest,
  DeploymentConfigResponse,
  DeploymentResponse,
  RemoveBlockExplorerApiKeyResponse,
  RemoveDeploymentConfigResponse,
  UpdateBlockExplorerApiKeyRequest,
  UpgradeContractRequest,
  UpgradeContractResponse,
} from '../models';

const DEPLOYMENTS_PATH = '/deployments';
const UPGRADES_PATH = '/upgrades';
const BLOCKEXPLORER_API_KEY_PATH = '/block-explorer-api-key';
const DEPLOYMENTS_CONFIG_PATH = '/deployment-config';

export class DeployClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.PLATFORM_POOL_ID || 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.PLATFORM_POOL_CLIENT_ID || '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.PLATFORM_API_URL || 'https://defender-api.openzeppelin.com/deployment/';
  }

  public async deployContract(payload: DeployContractRequest): Promise<DeploymentResponse> {
    if (isEmpty(payload.artifactUri) && isEmpty(payload.artifactPayload))
      throw new Error(
        `Missing artifact in deploy request. Either artifactPayload or artifactUri must be included in the request.`,
      );
    return this.apiCall(async (api) => {
      return api.post(`${DEPLOYMENTS_PATH}`, payload);
    });
  }

  public async getDeployedContract({ deploymentId }: { deploymentId: string }): Promise<DeploymentResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_PATH}/${deploymentId}`);
    });
  }

  public async listDeployments(): Promise<DeploymentResponse[]> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_PATH}`);
    });
  }

  public async getDeployApprovalProcess({ network }: { network: Network }): Promise<ApprovalProcessResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_PATH}/config/${network}`);
    });
  }

  public async upgradeContract(payload: UpgradeContractRequest): Promise<UpgradeContractResponse> {
    return this.apiCall(async (api) => {
      return api.post(`${UPGRADES_PATH}`, payload);
    });
  }

  public async getUpgradeApprovalProcess({ network }: { network: Network }): Promise<ApprovalProcessResponse> {
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
    payload: CreateBlockExplorerApiKeyRequest,
  ): Promise<BlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.post(`${BLOCKEXPLORER_API_KEY_PATH}`, payload);
    });
  }

  public async updateBlockExplorerApiKey(
    blockExplorerApiKeyId: string,
    payload: UpdateBlockExplorerApiKeyRequest,
  ): Promise<BlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.put(`${BLOCKEXPLORER_API_KEY_PATH}/${blockExplorerApiKeyId}`, payload);
    });
  }

  public async removeBlockExplorerApiKey(blockExplorerApiKeyId: string): Promise<RemoveBlockExplorerApiKeyResponse> {
    return this.apiCall(async (api) => {
      return api.delete(`${BLOCKEXPLORER_API_KEY_PATH}/${blockExplorerApiKeyId}`);
    });
  }

  public async getConfig({ deploymentConfigId }: { deploymentConfigId: string }): Promise<DeploymentConfigResponse> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_CONFIG_PATH}/${deploymentConfigId}`);
    });
  }
  public async listConfig(): Promise<DeploymentConfigResponse[]> {
    return this.apiCall(async (api) => {
      return api.get(`${DEPLOYMENTS_CONFIG_PATH}`);
    });
  }

  public async createConfig(payload: DeploymentConfigCreateRequest): Promise<DeploymentConfigResponse> {
    return this.apiCall(async (api) => {
      return api.post(`${DEPLOYMENTS_CONFIG_PATH}`, payload);
    });
  }

  public async updateConfig(
    deploymentConfigId: string,
    payload: DeploymentConfigCreateRequest,
  ): Promise<DeploymentConfigResponse> {
    return this.apiCall(async (api) => {
      return api.put(`${DEPLOYMENTS_CONFIG_PATH}/${deploymentConfigId}`, payload);
    });
  }

  public async removeConfig(deploymentConfigId: string): Promise<RemoveDeploymentConfigResponse> {
    return this.apiCall(async (api) => {
      return api.delete(`${DEPLOYMENTS_CONFIG_PATH}/${deploymentConfigId}`);
    });
  }
}
