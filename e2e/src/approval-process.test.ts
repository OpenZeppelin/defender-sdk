require('dotenv').config();
import { Defender } from '@openzeppelin/defender-sdk';

// Default timeout is not enough, using 15s timeout instead.
jest.setTimeout(15 * 1000);

describe('Approval process', () => {
  const approvalProcessClient = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  }).approvalProcess;

  it('should list approval processes', async () => {
    const result = await approvalProcessClient.list();
    expect(result).toBeDefined();
  });
});
