import { ActionRelayer } from '.';
import Lambda from '../__mocks__/aws-sdk/clients/lambda';
import { Lambda as LambdaV3 } from '../__mocks__/@aws-sdk/client-lambda';
jest.mock('node:process', () => ({
  ...jest.requireActual('node:process'),
  version: 'v16.0.3',
}));

type TestActionRelayer = Omit<ActionRelayer, 'lambda' | 'relayerARN'> & {
  lambda: ReturnType<typeof Lambda | typeof LambdaV3>;
  arn: string;
};

describe('ActionRelayer', () => {
  const credentials = {
    AccessKeyId: 'keyId',
    SecretAccessKey: 'accessKey',
    SessionToken: 'token',
  };

  const payload = {
    to: '0x0',
    gasLimit: 21000,
  };

  let relayer: TestActionRelayer;

  beforeEach(async function () {
    jest.mock('aws-sdk/clients/lambda', () => Lambda);
    jest.mock('@aws-sdk/client-lambda', () => ({ Lambda: LambdaV3 }));
    relayer = new ActionRelayer({
      credentials: JSON.stringify(credentials),
      relayerARN: 'arn',
      authConfig: { type: 'relay', useCredentialsCaching: false },
    }) as unknown as TestActionRelayer;
  });

  describe('constructor', () => {
    test('calls init', () => {
      expect(relayer.arn).toBe('arn');
      expect(relayer.lambda).not.toBeNull();
    });
  });

  describe('sendTransaction', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.sendTransaction(payload);
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"send-tx","payload":{"to":"0x0","gasLimit":21000}}',
      });
    });

    test('parses lambda error correctly', async () => {
      (relayer.lambda.invoke as jest.Mock).mockImplementationOnce(() => {
        return {
          promise: () => {
            return {
              FunctionError: 'Unhandled',
              Payload: JSON.stringify({ errorType: 'Error', errorMessage: 'error msg' }),
            };
          },
        };
      });
      await expect(relayer.sendTransaction(payload)).rejects.toThrow('Error while attempting request: error msg');
    });

    // if we can't make sense of the error format, we just return it
    test('parses garbage error', async () => {
      (relayer.lambda.invoke as jest.Mock).mockImplementationOnce(() => {
        return {
          promise: () => {
            return {
              FunctionError: 'Unhandled',
              Payload: 'garbage error',
            };
          },
        };
      });
      await expect(relayer.sendTransaction(payload)).rejects.toThrow('Error while attempting request: garbage error');
    });
  });

  describe('replaceTransaction', () => {
    test('passes nonce to the API', async () => {
      await relayer.replaceTransactionByNonce(10, payload);
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"replace-tx","payload":{"to":"0x0","gasLimit":21000}}',
      });
    });

    test('passes txId to the API', async () => {
      await relayer.replaceTransactionById('123-456-abc', payload);
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"replace-tx","txPayload":{"to":"0x0","gasLimit":21000,"id":"123-456-abc"}}',
      });
    });
  });

  describe('getRelayer', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.getRelayer();
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"get-self"}',
      });
    });
  });

  describe('sign', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.sign({ message: 'test' });
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"sign","payload":{"message":"test"}}',
      });
    });
  });

  describe('signTypedData', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.signTypedData({ domainSeparator: 'test', hashStructMessage: 'test' });
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"signTypedData","payload":{"domainSeparator":"test","hashStructMessage":"test"}}',
      });
    });
  });

  describe('query', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.getTransaction('42');
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"get-tx","payload":"42"}',
      });
    });
  });

  describe('list', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.listTransactions({ limit: 20 });
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"action":"list-txs","payload":{"limit":20}}',
      });
    });
  });

  describe('call', () => {
    test('passes correct arguments to the API', async () => {
      await relayer.call({ method: 'eth_call', params: ['0xa', '0xb'] });
      expect(relayer.lambda.invoke).toHaveBeenCalledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload:
          '{"action":"json-rpc-query","payload":{"method":"eth_call","params":["0xa","0xb"],"jsonrpc":"2.0","id":0}}',
      });
    });
  });
});
