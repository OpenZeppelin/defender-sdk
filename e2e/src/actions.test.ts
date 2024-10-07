require('dotenv').config();
import { Defender } from '@openzeppelin/defender-sdk';

// Default timeout is not enough, using 15s timeout instead.
jest.setTimeout(15 * 1000);

describe('actions', () => {
  const actionClient = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  }).action;

  it('should list actions', async () => {
    const result = await actionClient.list();
    expect(result.items).toBeDefined();
  });
});
