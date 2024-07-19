import { CreateBlockMonitorResponse, CreateFortaMonitorResponse } from './monitor';

export interface DeletedMonitorResponse {
  message: string;
}

export type CreateMonitorResponse = CreateBlockMonitorResponse | CreateFortaMonitorResponse;

export type ListMonitorResponse = {
  items: CreateMonitorResponse[];
  notificationsQuotaUsage: number;
  blockProcessedQuotaUsage: number;
  fortaAlertsQuotaUsage: number;
};
