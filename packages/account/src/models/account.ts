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

const ApiKeyCapabilityMap: Record<ApiKeyCapability, ApiKeyCapabilityV2> = {
  'manage-autotasks': 'manage-actions',
  'manage-subscribers': 'manage-monitors',
  'manage-address-book': 'manage-address-book',
  'create-admin-proposals': 'create-admin-proposals',
  'manage-deployments': 'manage-deployments',
  'manage-relayers': 'manage-relayers',
  'manage-tenant-networks': 'manage-tenant-networks',
  'manage-forked-networks': 'manage-tenant-networks',
};

export const toApiKeysCapabilityV2 = (capability: ApiKeyCapability) => ApiKeyCapabilityMap[capability] ?? capability;
