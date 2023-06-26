import { ActionRelayer } from '.';
import Lambda from 'aws-sdk/clients/lambda';

type TestActionRelayer = Omit<ActionRelayer, 'lambda' | 'relayerARN'> & { lambda: Lambda; arn: string };

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
    }) as unknown as TestActionRelayer;
  });

  describe('get rate limited', () => {
    test('throw Rate limit error after 300 requests', async () => {
      const rateLimit = 300;

      await waitNextSecondStart();

      let hasBeenRateLimited = false;

      await Promise.all(
        Array.from({ length: 302 }).map(async (ignore, index) => {
          try {
            await relayer.getTransaction({ id: '42' });
          } catch (error) {
            expect(index).toBe(rateLimit + 1);
            expect(error.message).toBe('Rate limit exceeded');
            hasBeenRateLimited = true;
          }
        }),
      );

      await sleep(1000);

      const afterTheLimitQueryResult = await relayer.getTransaction({ id: '42' });

      expect(hasBeenRateLimited).toBe(true);
      expect(Boolean(afterTheLimitQueryResult)).toBe(true);
    });
  });
});
