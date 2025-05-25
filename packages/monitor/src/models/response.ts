import { CreateBlockMonitorResponse } from './monitor';

export interface DeletedMonitorResponse {
  message: string;
}

export type CreateMonitorResponse = CreateBlockMonitorResponse;

export type ListMonitorResponse = {
  items: CreateMonitorResponse[];
  notificationsQuotaUsage: number;
  blockProcessedQuotaUsage: number;
};
