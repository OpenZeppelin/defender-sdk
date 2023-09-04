import { AxiosInstance } from 'axios';
import { NetworkClient } from '.';
import { ForkedNetworkCreateRequest } from '../models/networks';

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

const createForkPayload: ForkedNetworkCreateRequest = {
  name: 'mock-fork',
  forkedNetwork: 'mainnet',
  rpcUrl: 'https://localhost:8585',
  blockExplorerUrl: 'https://localhost:8585/explorer',
};

describe('NetworkClient', () => {
  let networkClient: TestNetworkClient;

  beforeEach(() => {
    networkClient = (new NetworkClient({ apiKey: 'key', apiSecret: 'secret' }) as unknown) as TestNetworkClient;
    createAuthenticatedApi.mockClear();
  });

  describe('constructor', () => {
    it('sets API key and secret', () => {
      expect(networkClient.apiKey).toBe('key');
      expect(networkClient.apiSecret).toBe('secret');
    });

    it("doesn't call init more than once", async () => {
      await networkClient.list();
      await networkClient.list();
      await networkClient.list();

      expect(createAuthenticatedApi).toBeCalledTimes(1);
    });

    it('throws an init exception at the correct context', async () => {
      networkClient.init = () => {
        throw new Error('Init failed');
      };
      await expect(networkClient.create(createForkPayload)).rejects.toThrow(/init failed/i);
      expect(networkClient.api).toBe(undefined);
    });
  });

  describe('renew Id token on apiCall throw', () => {
    beforeEach(async () => {
      // Call first so it's not supposed to be called again
      await networkClient.init();
    });

    it('renews token', async () => {
      jest.spyOn(networkClient.api, 'get').mockImplementationOnce(() => {
        return Promise.reject({ response: { status: 401, statusText: 'Unauthorized' } });
      });

      await networkClient.list();
      expect(networkClient.api.get).toBeCalledWith('/networks/forks');
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
    it('calls API correctly', async () => {
      await networkClient.list();
      expect(networkClient.api.get).toBeCalledWith('/networks/forks');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('create', () => {
    it('calls API correctly', async () => {
      await networkClient.create(createForkPayload);
      expect(networkClient.api.post).toBeCalledWith('/networks/forks', createForkPayload);
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('get', () => {
    it('calls API correctly', async () => {
      await networkClient.get('123-456-789');
      expect(networkClient.api.get).toBeCalledWith('/networks/forks/123-456-789');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('update', () => {
    it('calls API correctly', async () => {
      const forkedNetworkId = '123-456-789';
      await networkClient.update(forkedNetworkId, { blockExplorerUrl: 'https://localhost:8000/explorer' });
      expect(networkClient.api.put).toBeCalledWith(`/networks/forks/${forkedNetworkId}`, {
        blockExplorerUrl: 'https://localhost:8000/explorer',
      });
      expect(createAuthenticatedApi).toBeCalled();
    });
  });

  describe('delete', () => {
    it('calls API correctly', async () => {
      await networkClient.delete('123-456-789');
      expect(networkClient.api.delete).toBeCalledWith('/networks/forks/123-456-789');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });
});
