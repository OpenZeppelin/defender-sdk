import { DeployClient } from './index';
import { CreateBlockExplorerApiKeyRequest, UpdateBlockExplorerApiKeyRequest } from '../models';
import { TestClient } from '../utils/index';

jest.mock('@openzeppelin/defender-sdk-base-client');
jest.mock('aws-sdk');
jest.mock('axios');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createAuthenticatedApi } = require('@openzeppelin/defender-sdk-base-client');

describe('Block Explorer Api Key Client', () => {
  let client: TestClient<DeployClient>;

  const createPaylod: CreateBlockExplorerApiKeyRequest = {
    key: 'random-key',
    network: 'sepolia',
  };
  const updatePaylod: UpdateBlockExplorerApiKeyRequest = {
    key: 'random-key',
  };
  beforeEach(() => {
    client = new DeployClient({
      apiKey: 'key',
      apiSecret: 'secret',
    }) as unknown as TestClient<DeployClient>;
    createAuthenticatedApi.mockClear();
  });
  describe('constructor', () => {
    it('sets API key and secret', () => {
      expect(client.apiKey).toBe('key');
      expect(client.apiSecret).toBe('secret');
    });

    it("doesn't call init more than once", async () => {
      await client.listBlockExplorerApiKeys();
      await client.listBlockExplorerApiKeys();
      await client.listBlockExplorerApiKeys();
      expect(createAuthenticatedApi).toBeCalledTimes(1);
    });
    it('throws an init exception at the correct context', async () => {
      client.init = () => {
        throw new Error('Init failed');
      };
      await expect(client.listBlockExplorerApiKeys()).rejects.toThrow(/init failed/i);
      expect(client.api).toBe(undefined);
    });
  });
  describe('renew Id token on apiCall throw', () => {
    beforeEach(async () => {
      // Call first so it's not supposed to be called again
      await client.init();
    });

    it('renews token', async () => {
      jest.spyOn(client.api, 'get').mockImplementationOnce(() => {
        return Promise.reject({ response: { status: 401, statusText: 'Unauthorized' } });
      });

      await client.listBlockExplorerApiKeys();
      expect(client.api.get).toBeCalledWith('/block-explorer-api-key');
      expect(createAuthenticatedApi).toBeCalledTimes(2); // First time and renewal
    });
  });
  describe('list', () => {
    it('calls API correctly', async () => {
      await client.listBlockExplorerApiKeys();
      expect(client.api.get).toBeCalledWith('/block-explorer-api-key');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });
  describe('create', () => {
    it('calls API correctly', async () => {
      await client.createBlockExplorerApiKey(createPaylod);
      expect(client.api.post).toBeCalledWith('/block-explorer-api-key', createPaylod);
      expect(createAuthenticatedApi).toBeCalled();
    });
  });
  describe('get', () => {
    it('calls API correctly', async () => {
      await client.getBlockExplorerApiKey('api-key-id');
      expect(client.api.get).toBeCalledWith('/block-explorer-api-key/api-key-id');
      expect(createAuthenticatedApi).toBeCalled();
    });
  });
  describe('update', () => {
    it('calls API correctly', async () => {
      await client.updateBlockExplorerApiKey('api-key-id', updatePaylod);
      expect(client.api.put).toBeCalledWith('/block-explorer-api-key/api-key-id', updatePaylod);
      expect(createAuthenticatedApi).toBeCalled();
    });
  });
});
