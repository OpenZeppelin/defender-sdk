import { AxiosInstance } from 'axios';
import { MonitorClient } from '.';
import { NotificationResponse } from '..';
import { BlockWatcher } from '../models/blockwatcher';
import { CreateMonitorResponse } from '../models/response';
import { ExternalCreateBlockMonitorRequest, ExternalCreateFortaMonitorRequest } from '../models/monitor';

jest.mock('@openzeppelin/defender-sdk-base-client');
jest.mock('aws-sdk');
jest.mock('axios');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createAuthenticatedApi } = require('@openzeppelin/defender-sdk-base-client');

type TestMonitorClient = Omit<MonitorClient, 'api'> & {
  api: AxiosInstance;
  apiKey: string;
  apiSecret: string;
  init: () => Promise<void>;
};

describe('MonitorClient', () => {
  let monitor: TestMonitorClient;
  let listBlockwatchersSpy: jest.SpyInstance<Promise<BlockWatcher[]>>;
  // TODO: move to notification channel package
  let listNotificationChannelsSpy: jest.SpyInstance<Promise<NotificationResponse[]>>;
  const ABI = `[{
    "anonymous": false,
    "inputs": [{
      "indexed": true,
      "internalType": "address",
      "name": "owner",
      "type": "address"
    }, {
      "indexed": true,
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }, {
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }],
    "name": "Approval",
    "type": "event"
  }, {
    "inputs": [{
      "internalType": "address",
      "name": "spender",
      "type": "address"
    }, {
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }],
    "name": "approve",
    "outputs": [{
      "internalType": "bool",
      "name": "",
      "type": "bool"
    }],
    "stateMutability": "nonpayable",
    "type": "function"
  }]`;
  const createBlockPayload: ExternalCreateBlockMonitorRequest = {
    type: 'BLOCK',
    name: 'Test BLOCK monitor',
    addresses: ['0xdead'],
    notificationChannels: [],
    network: 'sepolia',
    confirmLevel: 1,
    paused: false,
    abi: ABI,
    txCondition: 'value == 1',
    eventConditions: [
      {
        eventSignature: 'Approval(address,address,uint256)',
        expression: '',
      },
    ],
    functionConditions: [
      {
        expression: '',
        functionSignature: 'approve(address,uint256)',
      },
    ],
  };
  const createFortaPayload: ExternalCreateFortaMonitorRequest = {
    type: 'FORTA',
    name: 'Test FORTA monitor',
    network: 'sepolia',
    addresses: ['0xdead'],
    notificationChannels: [],
    paused: false,
    fortaConditions: { minimumScannerCount: 1 },
  };

  const oldBlockMonitor: CreateMonitorResponse = {
    type: 'BLOCK',
    monitorId: 'old-monitor-id',
    name: 'Previous monitor',
    paused: false,
    blockWatcherId: 'i-am-the-watcher',
    network: 'sepolia',
    addressRules: [
      {
        abi: '[{ method: "type" }]',
        addresses: ['0xdead1', '0xdead2'],
        conditions: [
          {
            eventConditions: [{ eventSignature: '0x01' }],
            txConditions: [],
            functionConditions: [],
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    monitor = new MonitorClient({ apiKey: 'key', apiSecret: 'secret' }) as unknown as TestMonitorClient;
    createAuthenticatedApi.mockClear();

    listBlockwatchersSpy = jest.spyOn(monitor, 'listBlockwatchers').mockImplementation(async () => [
      {
        blockWatcherId: 'i-am-the-watcher',
        network: createBlockPayload.network,
        confirmLevel: createBlockPayload.confirmLevel,
      } as BlockWatcher,
    ]);
    // TODO: move to notification channel package
    listNotificationChannelsSpy = jest
      .spyOn(monitor, 'listNotificationChannels')
      .mockImplementation(async () => [{} as NotificationResponse]);
  });

  describe('constructor', () => {
    it('sets API key and secret', () => {
      expect(monitor.apiKey).toBe('key');
      expect(monitor.apiSecret).toBe('secret');
    });

    it("doesn't call init more than once", async () => {
      await monitor.list();
      await monitor.list();
      await monitor.list();

      expect(createAuthenticatedApi).toHaveBeenCalledTimes(1);
    });

    it('throws an init exception at the correct context', async () => {
      monitor.init = () => {
        throw new Error('Init failed');
      };
      await expect(monitor.create(createBlockPayload)).rejects.toThrow(/init failed/i);
      expect(monitor.api).toBe(undefined);
    });
  });

  describe('renew Id token on apiCall throw', () => {
    beforeEach(async () => {
      // Call first so it's not supposed to be called again
      await monitor.init();
    });

    it('renews token', async () => {
      jest.spyOn(monitor.api, 'get').mockImplementationOnce(() => {
        return Promise.reject({ response: { status: 401, statusText: 'Unauthorized' } });
      });

      await monitor.list();
      expect(monitor.api.get).toHaveBeenCalledWith('/monitors');
      expect(createAuthenticatedApi).toHaveBeenCalledTimes(2); // First time and renewal
    });
  });

  describe('list', () => {
    it('calls API correctly', async () => {
      await monitor.list();
      expect(monitor.api.get).toHaveBeenCalledWith('/monitors');
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('passes correct BLOCK type arguments to the API', async () => {
      const { name, network, paused, type, addresses, abi, txCondition, eventConditions, functionConditions } =
        createBlockPayload;

      const expectedApiRequest = {
        paused,
        type,
        name,
        network,
        addressRules: [
          {
            abi,
            addresses: addresses,
            actionCondition: undefined,
            conditions: [
              {
                eventConditions,
                txConditions: [{ expression: txCondition, status: 'any' }],
                functionConditions: [],
              },
              {
                eventConditions: [],
                txConditions: [{ expression: txCondition, status: 'any' }],
                functionConditions,
              },
            ],
          },
        ],
        alertThreshold: undefined,
        blockWatcherId: 'i-am-the-watcher',
        notifyConfig: {
          actionId: undefined,
          notifications: [],
          timeoutMs: 0,
        },
      };

      await monitor.create(createBlockPayload);
      expect(monitor.api.post).toHaveBeenCalledWith('/monitors', expectedApiRequest);
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });

    it('passes correct FORTA type arguments to the API', async () => {
      const { name, paused, type, addresses, fortaConditions, network } = createFortaPayload;

      const expectedApiRequest = {
        paused,
        type,
        name,
        network,
        alertThreshold: undefined,
        notifyConfig: {
          actionId: undefined,
          notifications: [],
          timeoutMs: 0,
        },
        fortaRule: {
          addresses: addresses,
          agentIDs: undefined,
          actionCondition: undefined,
          conditions: fortaConditions,
        },
      };

      await monitor.create(createFortaPayload);
      expect(monitor.api.post).toHaveBeenCalledWith('/monitors', expectedApiRequest);
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
    it('passes correct Private FORTA type arguments to the API', async () => {
      const { name, paused, type, addresses, fortaConditions, network } = createFortaPayload;

      const expectedApiRequest = {
        paused,
        type,
        name,
        network,
        privateFortaNodeId: '0x123',
        alertThreshold: undefined,
        notifyConfig: {
          actionId: undefined,
          notifications: [],
          timeoutMs: 0,
        },
        fortaRule: {
          addresses: addresses,
          agentIDs: undefined,
          actionCondition: undefined,
          conditions: fortaConditions,
        },
      };

      await monitor.create({ ...createFortaPayload, privateFortaNodeId: '0x123' });
      expect(monitor.api.post).toHaveBeenCalledWith('/monitors', expectedApiRequest);
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('passes correct arguments to the API', async () => {
      await monitor.get('i-am-the-watcher');
      expect(monitor.api.get).toBeCalledWith('/monitors/i-am-the-watcher');
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('passes correct BLOCK type arguments to the API', async () => {
      const monitorId = 'i-am-the-BLOCK-watcher';
      await monitor.update(monitorId, { monitorId, ...createBlockPayload });
      expect(monitor.api.put).toHaveBeenCalledWith(`/monitors/${monitorId}`, { monitorId, ...createBlockPayload });
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });

    it('passes correct FORTA type arguments to the API', async () => {
      const monitorId = 'i-am-the-FORTA-watcher';
      await monitor.update(monitorId, { monitorId, ...createFortaPayload });
      expect(monitor.api.put).toHaveBeenCalledWith(`/monitors/${monitorId}`, { monitorId, ...createFortaPayload });
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('pause', () => {
    it('passes correct arguments to the API', async () => {
      const monitorId = 'i-am-the-BLOCK-watcher';
      await monitor.pause(monitorId);
      expect(monitor.api.put).toHaveBeenCalledWith(`/monitors/${monitorId}`, { paused: true });
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('unpause', () => {
    it('passes correct arguments to the API', async () => {
      const monitorId = 'i-am-the-BLOCK-watcher';
      await monitor.unpause(monitorId);
      expect(monitor.api.put).toHaveBeenCalledWith(`/monitors/${monitorId}`, { paused: false });
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('passes correct arguments to the API', async () => {
      await monitor.delete('i-am-the-watcher');
      expect(monitor.api.delete).toHaveBeenCalledWith('/monitors/i-am-the-watcher');
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  // TODO: move to notification channel tests
  // describe('createNotificationChannel', () => {
  //   it('passes correct arguments to the API', async () => {
  //     const type = 'slack';
  //     const notification: CreateNotificationRequest = {
  //       type,
  //       name: 'some test',
  //       config: {
  //         url: 'test.slack.com',
  //       },
  //       paused: false,
  //     };
  //     await monitor.createNotificationChannel(notification);
  //     expect(monitor.api.post).toBeCalledWith(`/notifications/${type}`, notification);
  //     expect(createAuthenticatedApi).toBeCalled();
  //   });
  // });

  // describe('listNotificationChannels', () => {
  //   it('calls API correctly', async () => {
  //     listNotificationChannelsSpy.mockRestore();
  //     await monitor.listNotificationChannels();
  //     expect(monitor.api.get).toBeCalledWith('/notifications');
  //     expect(createAuthenticatedApi).toBeCalled();
  //   });
  // });

  // describe('deleteNotificationChannel', () => {
  //   it('passes correct arguments to the API', async () => {
  //     const type = 'slack';
  //     const notificationId = '1';
  //     const notification: DeleteNotificationRequest = {
  //       type,
  //       notificationId,
  //     };
  //     await monitor.deleteNotificationChannel(notification);
  //     expect(monitor.api.delete).toBeCalledWith(`/notifications/${type}/${notification.notificationId}`);
  //     expect(createAuthenticatedApi).toBeCalled();
  //   });
  // });

  // describe('getNotificationChannel', () => {
  //   it('passes correct arguments to the API', async () => {
  //     const type = 'slack';
  //     const notificationId = '1';
  //     const notification: GetNotificationRequest = {
  //       type,
  //       notificationId,
  //     };
  //     await monitor.getNotificationChannel(notification);
  //     expect(monitor.api.get).toBeCalledWith(`/notifications/${type}/${notification.notificationId}`);
  //     expect(createAuthenticatedApi).toBeCalled();
  //   });
  // });

  // describe('updateNotificationChannel', () => {
  //   it('passes correct arguments to the API', async () => {
  //     const type = 'slack';
  //     const notificationId = '1';

  //     const notification: UpdateNotificationRequest = {
  //       type,
  //       notificationId,
  //       name: 'some test',
  //       config: {
  //         url: 'test.slack.com',
  //       },
  //       paused: false,
  //     };
  //     await monitor.updateNotificationChannel(notification);
  //     expect(monitor.api.put).toBeCalledWith(`/notifications/${type}/${notificationId}`, notification);
  //     expect(createAuthenticatedApi).toBeCalled();
  //   });
  // });

  describe('listBlockwatchers', () => {
    it('calls API correctly', async () => {
      listBlockwatchersSpy.mockRestore();
      await monitor.listBlockwatchers();
      expect(monitor.api.get).toHaveBeenCalledWith('/blockwatchers');
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('listTenantBlockwatchers', () => {
    it('calls API correctly', async () => {
      listBlockwatchersSpy.mockRestore();
      await monitor.listTenantBlockwatchers();
      expect(monitor.api.get).toHaveBeenCalledWith('/blockwatchers/tenant');
      expect(createAuthenticatedApi).toHaveBeenCalled();
    });
  });

  describe('getBlockwatcherIdByNetwork', () => {
    it('finds blockwatchers for network when there are available', async () => {
      // Make sure the network provided is the network mocked above
      const results = await monitor.getBlockwatcherIdByNetwork('sepolia');
      if (!results[0]) throw new Error('results is empty');
      expect(results[0].blockWatcherId).toEqual('i-am-the-watcher');
    });

    it('does not find blockwatchers for network when there are none', async () => {
      const results = await monitor.getBlockwatcherIdByNetwork('non-supported');
      expect(results).toEqual([]);
    });
  });
});
