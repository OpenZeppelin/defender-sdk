import { Network } from '@openzeppelin/defender-sdk-base-client';

export interface DeploymentConfigCreateRequest {
  relayerId: string;
  stackResourceId?: string;
}

export interface DeploymentConfigResponse {
  deploymentConfigId: string;
  relayerId: string;
  network: Network;
  createdAt: string;
  stackResourceId?: string;
}

export interface RemoveDeploymentConfigResponse {
  message: string;
}
