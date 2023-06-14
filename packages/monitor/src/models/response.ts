import { CreateBlockSubscriberResponse, CreateFortaSubscriberResponse } from './subscriber';

export interface DeletedMonitorResponse {
  message: string;
}

export type CreateMonitorResponse = CreateBlockSubscriberResponse | CreateFortaSubscriberResponse;

export type ListMonitorResponse = {
  items: CreateMonitorResponse[];
  notificationsQuotaUsage: number;
  blockProcessedQuotaUsage: number;
  fortaAlertsQuotaUsage: number;
};
