import { BaseApiClient } from '@openzeppelin/defender-sdk-base-client';
import { AddressBookResponse, CreateAddressBookRequest } from '../models/address-book';

const PATH = '/address-book';

export class AddressBookClient extends BaseApiClient {
  protected getPoolId(): string {
    return process.env.DEFENDER_POOL_ID ?? 'us-west-2_94f3puJWv';
  }

  protected getPoolClientId(): string {
    return process.env.DEFENDER_POOL_CLIENT_ID ?? '40e58hbc7pktmnp9i26hh5nsav';
  }

  protected getApiUrl(): string {
    return process.env.DEFENDER_API_URL ?? 'https://defender-api.openzeppelin.com/';
  }

  public async list(): Promise<AddressBookResponse[]> {
    return this.apiCall(async (api) => api.get(`${PATH}`));
  }

  public async create(address: CreateAddressBookRequest): Promise<AddressBookResponse> {
    return this.apiCall(async (api) => api.post(`${PATH}`, address));
  }

  public async delete(addressBookId: string): Promise<{ message: string }> {
    const encodedId = encodeURIComponent(addressBookId);
    return this.apiCall(async (api) => api.delete(`${PATH}/${encodedId}`));
  }
}
