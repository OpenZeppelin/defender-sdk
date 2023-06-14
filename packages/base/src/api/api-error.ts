import { Method, AxiosError, AxiosResponse } from 'axios';
import { pick } from 'lodash/fp';

type PickedAxiosErrorFields<TError> = {
  request: { path: string; method: Method };
  response: { status: number; statusText: string; data?: TError };
};

export class PlatformApiResponseError<TErrorData = unknown> extends Error {
  public name = 'PlatformApiResponseError';

  public request: PickedAxiosErrorFields<TErrorData>['request'];
  public response: PickedAxiosErrorFields<TErrorData>['response'];

  constructor(axiosError: AxiosError<TErrorData>) {
    super(axiosError.message);
    this.request = pick(['path', 'method'], axiosError.request);
    this.response = pick(['status', 'statusText', 'data'], axiosError.response as AxiosResponse<TErrorData>);
  }
}
