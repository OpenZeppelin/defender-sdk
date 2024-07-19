import { AxiosInstance } from 'axios';
import { NetworkClient } from '.';
import { TenantNetworkCreateRequest } from '../models/networks';

jest.mock('@openzeppelin/defender-sdk-base-client');
jest.mock('aws-sdk');
jest.mock('axios');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createAuthenticatedApi } = require('@openzeppelin/defender-sdk-base-client');

type TestNetworkClient = Omit<NetworkClient, 'api'> & {
  api: AxiosInstance;
  apiKey: string;
  apiSecret: string;
  init: () => Promise<void>;
};

const createForkPayload: TenantNetworkCreateRequest = {
  name: 'mock-fork',
  supportedNetwork: 'mainnet',
  rpcUrl: 'https://localhost:8585',
  blockExplorerUrl: 'https://localhost:8585/explorer',
  networkType: 'fork',
};

const createPrivatePayload: TenantNetworkCreateRequest = {
  name: 'mock-fork',
  rpcUrl: 'https://localhost:8585',
  blockExplorerUrl: 'https://localhost:8585/explorer',
  configuration: {
    symbol: 'ETH',
  },
  networkType: 'private',
};

describe('NetworkClient', () => {
  let networkClient: TestNetworkClient;

  beforeEach(() => {
    networkClient = new NetworkClient({ apiKey: 'key', apiSecret: 'secret' }) as unknown as TestNetworkClient;
    createAuthenticatedApi.mockClear();
  });

  describe('constructor', () => {
    it('sets API key and secret', () => {
      expect(networkClient.apiKey).toBe('key');
      expect(networkClient.apiSecret).toBe('secret');
    });

    it("doesn't call init more than once (fork)", async () => {
      await networkClient.listForkedNetworks();
      await networkClient.listForkedNetworks();
      await networkClient.listForkedNetworks();

      expect(createAuthenticatedApi).toBeCalledTimes(1);
    });

    it("doesn't call init more than once (private)", async () => {
      await networkClient.listPrivateNetworks();
      await networkClient.listPrivateNetworks();
      await networkClient.listPrivateNetworks();

      expect(createAuthenticatedApi).toBeCalledTimes(1);
    });

    it('throws an init exception at the correct context (fork)', async () => {
      networkClient.init = () => {
        throw new Error('Init failed');
      };
      await expect(networkClient.createForkedNetwork(createForkPayload)).rejects.toThrow(/init failed/i);
      expect(networkClient.api).toBe(undefined);
    });

    it('throws an init exception at the correct context (private)', async () => {
      networkClient.init = () => {
        throw new Error('Init failed');
      };
      await expect(networkClient.createPrivateNetwork(createPrivatePayload)).rejects.toThrow(/init failed/i);
      expect(networkClient.api).toBe(undefined);
    });
  });

  describe('renew Id token on apiCall throw', () => {
    beforeEach(async () => {
      // Call first so it's not supposed to be called again
      await networkClient.init();
    });

    it('renews token (fork)', async () => {
      jest.spyOn(networkClient.api, 'get').mockImplementationOnce(() => {
        return Promise.reject({ response: { status: 401, statusText: 'Unauthorized' } });
      });

      await networkClient.listForkedNetworks();
      expect(networkClient.api.get).toBeCalledWith('/networks/fork');
      expect(createAuthenticatedApi).toBeCalledTimes(2); // First time and renewal
    });

    it('renews token (private)', async () => {
      jest.spyOn(networkClient.api, 'get').mockImplementationOnce(() => {
        return Promise.reject({ response: { status: 401, statusText: 'Unauthorized' } });
      });

      await networkClient.listPrivateNetworks();
      expect(networkClient.api.get).toBeCalledWith('/networks/private');
      expect(createAuthenticatedApi).toBeCalledTimes(2); // First time and renewal
    });
  });

  describe('list supported networks', () => {
    it('calls API correctly', async () => {
      await networkClient.listSupportedNetworks();
      expect(networkClient.api.get).toBeCalledWith('/networks');
      expect(createAuthenticatedApi).toBeCalled();
    });

    it('calls API correctly with network type', async () => {
      await networkClient.listSupportedNetworks({ networkType: 'production' });
      expect(networkClient.api.get).toBeCalledWith('/networks?type=production');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('list', () => {
    it('calls API correctly (fork)', async () => {
      await networkClient.listForkedNetworks();
      expect(networkClient.api.get).toBeCalledWith('/networks/fork');
      expect(createAuthenticatedApi).toBeCalled();
    });

    it('calls API correctly (private)', async () => {
      await networkClient.listPrivateNetworks();
      expect(networkClient.api.get).toBeCalledWith('/networks/private');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('create', () => {
    it('calls API correctly (fork)', async () => {
      await networkClient.createForkedNetwork(createForkPayload);
      expect(networkClient.api.post).toBeCalledWith('/networks/fork', createForkPayload);
      expect(createAuthenticatedApi).toBeCalled();
    });

    it('calls API correctly (private)', async () => {
      await networkClient.createPrivateNetwork(createPrivatePayload);
      expect(networkClient.api.post).toBeCalledWith('/networks/private', createPrivatePayload);
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('get', () => {
    it('calls API correctly (fork)', async () => {
      await networkClient.getForkedNetwork('123-456-789');
      expect(networkClient.api.get).toBeCalledWith('/networks/fork/123-456-789');
      expect(createAuthenticatedApi).toBeCalled();
    });

    it('calls API correctly (private)', async () => {
      await networkClient.getPrivateNetwork('123-456-780');
      expect(networkClient.api.get).toBeCalledWith('/networks/private/123-456-780');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('update', () => {
    it('calls API correctly (fork)', async () => {
      const tenantNetworkId = '123-456-789';
      await networkClient.updateForkedNetwork(tenantNetworkId, { blockExplorerUrl: 'https://localhost:8000/explorer' });
      expect(networkClient.api.put).toBeCalledWith(`/networks/fork/${tenantNetworkId}`, {
        tenantNetworkId,
        blockExplorerUrl: 'https://localhost:8000/explorer',
      });
      expect(createAuthenticatedApi).toBeCalled();
    });

    it('calls API correctly (private)', async () => {
      const tenantNetworkId = '123-456-780';
      await networkClient.updatePrivateNetwork(tenantNetworkId, {
        blockExplorerUrl: 'https://localhost:8000/explorer',
      });
      expect(networkClient.api.put).toBeCalledWith(`/networks/private/${tenantNetworkId}`, {
        tenantNetworkId,
        blockExplorerUrl: 'https://localhost:8000/explorer',
      });
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('delete', () => {
    it('calls API correctly (fork)', async () => {
      await networkClient.deleteForkedNetwork('123-456-789');
      expect(networkClient.api.delete).toBeCalledWith('/networks/fork/123-456-789');
      expect(createAuthenticatedApi).toBeCalled();
    });
    it('calls API correctly (private)', async () => {
      await networkClient.deletePrivateNetwork('123-456-780');
      expect(networkClient.api.delete).toBeCalledWith('/networks/private/123-456-780');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });
});
