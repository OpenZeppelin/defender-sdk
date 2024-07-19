import axios from 'axios';
import { createApi } from './api';

jest.mock('axios');

const apiUrl = 'http://defender-api.openzeppelin.com/';
const key = 'key';
const token = 'token';

describe('createApi', () => {
  test('passes correct arguments to axios', () => {
    createApi(apiUrl, key, token);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: apiUrl,
      headers: {
        'X-Api-Key': key,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  });

  test('include headers overrides', () => {
    createApi(apiUrl, key, token, undefined, { 'X-Test': 'test' });
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: apiUrl,
      headers: {
        'X-Api-Key': key,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Test': 'test',
      },
    });
  });
});
