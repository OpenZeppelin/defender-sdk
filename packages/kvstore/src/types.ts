export type KeyValueStoreCreateParams = {
  credentials: string;
  kvstoreARN: string;
};

export type LocalKeyValueStoreCreateParams = {
  path: string;
};

export function isLocalCreateParams(params: any): params is LocalKeyValueStoreCreateParams {
  return !!params && !!(params as LocalKeyValueStoreCreateParams).path;
}

export function isActionCreateParams(params: any): params is KeyValueStoreCreateParams {
  const asCreateParams = params as KeyValueStoreCreateParams;
  return !!params && !!asCreateParams.credentials && !!asCreateParams.kvstoreARN;
}

export interface KeyValueStoreRequest {
  action: 'put' | 'get' | 'del';
  key: string;
  value?: string;
}

export interface IKeyValueStoreClient {
  get(key: string): Promise<string | undefined>;
  put(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}
