type AccountUsage =
  | {
      name: string;
      description: string;
      used: number;
      limit: number;
      overage?: number;
      remaining: number;
      period: 'hour' | 'month' | 'total';
    }
  | {
      name: string;
      error: string;
    };

export type AccountUsageResponse = Record<string, AccountUsage>;

export type ApiKeyCapability =
  | 'create-admin-proposals'
  | 'manage-relayers'
  | 'manage-autotasks'
  | 'manage-subscribers'
  | 'manage-deployments'
  | 'manage-tenant-networks'
  | 'manage-forked-networks'
  | 'manage-address-book';

export type ApiKeyCapabilityV2 =
  | 'create-admin-proposals'
  | 'manage-relayers'
  | 'manage-actions'
  | 'manage-monitors'
  | 'manage-deployments'
  | 'manage-tenant-networks'
  | 'manage-address-book';

export const toApiKeysCapabilityV2 = (capability: ApiKeyCapability): ApiKeyCapabilityV2 => {
  if (capability === 'manage-autotasks') return 'manage-actions';
  if (capability === 'manage-subscribers') return 'manage-monitors';
  return capability as ApiKeyCapabilityV2;
};
