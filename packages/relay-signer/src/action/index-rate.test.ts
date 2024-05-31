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

const getTime = () => Math.floor(Date.now() / 1000);
const sleep = (millisecond: number) => new Promise((resolve) => setTimeout(resolve, millisecond));

const waitNextSecondStart = async () => {
  const startTime = getTime();

  let currentTime = startTime;

  while (startTime === currentTime) {
    await sleep(10);
    currentTime = getTime();
  }

  return true;
};

describe('ActionRelayer', () => {
  const credentials = {
    AccessKeyId: 'keyId',
    SecretAccessKey: 'accessKey',
    SessionToken: 'token',
  };

  let relayer: TestActionRelayer;

  beforeEach(async function () {
    relayer = new ActionRelayer({
      credentials: JSON.stringify(credentials),
      relayerARN: 'arn',
      authConfig: { type: 'relay', useCredentialsCaching: false },
    }) as unknown as TestActionRelayer;
  });

  describe('get rate limited', () => {
    jest.mock('aws-sdk/clients/lambda', () => Lambda);
    jest.mock('@aws-sdk/client-lambda', () => ({ Lambda: LambdaV3 }));
    test('throw Rate limit error after 300 requests', async () => {
      const rateLimit = 300;

      await waitNextSecondStart();

      let hasBeenRateLimited = false;

      await Promise.all(
        Array.from({ length: 302 }).map(async (ignore, index) => {
          try {
            await relayer.getTransaction('42');
          } catch (error) {
            expect(index).toBe(rateLimit + 1);
            expect((error as any).message).toBe('Rate limit exceeded');
            hasBeenRateLimited = true;
          }
        }),
      );

      await sleep(1000);

      const afterTheLimitQueryResult = await relayer.getTransaction('42');

      expect(hasBeenRateLimited).toBe(true);
      expect(Boolean(afterTheLimitQueryResult)).toBe(true);
    });
  });
});
