import { Action } from './action';

export type ActionListResponse = {
  items: Action[];
  keyValueStoreItemsCount: number;
  runsQuotaUsage: number;
};

export type ActionResponse = Action;

export type ActionDeleteResponse = {
  message: string;
};
