require('dotenv').config();
import { Defender } from '@openzeppelin/defender-sdk';

// Default timeout is not enough, using 15s timeout instead.
jest.setTimeout(15 * 1000);

describe('address-book', () => {
  const addressBookClient = new Defender({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
  }).addressBook;

  it('should list addresses', async () => {
    const result = await addressBookClient.list();
    expect(result).toBeDefined();
  });

  it('should create and delete an address', async () => {
    const result = await addressBookClient.create({
      address: '0x1234567890123456789012345678901234567890',
      network: 'mainnet',
      type: 'EOA',
      alias: 'My Address',
    });
    expect(result.addressBookId).toBe('mainnet|0x1234567890123456789012345678901234567890');

    const deleteResult = await addressBookClient.delete(result.addressBookId);
    expect(deleteResult.message).toBe('mainnet|0x1234567890123456789012345678901234567890 deleted');
  });
});
