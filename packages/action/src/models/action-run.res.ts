import { Action } from './action';

export type ActionRunTrigger = Action['trigger']['type'] | 'sentinel' | 'manual' | 'manual-api';
export type ActionRunStatus = ActionRunResponse['status'];

export type ActionErrorType = 'TIMEOUT' | 'INSUFFICIENT_FUNDS' | 'RELAYER_CONFIGURATION' | 'INTERNAL' | 'PROGRAM';

export interface ActionRunBase {
  actionRunId: string;
  actionId: string;
  trigger: ActionRunTrigger;
  status: string;
  createdAt: string;
  errorType?: ActionErrorType;
}

export interface ActionRunPendingData {
  status: 'pending';
}

export interface ActionRunThrottledData {
  status: 'throttled';
}

export interface ActionRunErrorData {
  status: 'error';
  message: string;
  decodedLogs?: string; // External API always returns decoded logs
  requestId?: string;
  errorType?: ActionErrorType;
}

export interface ActionRunSuccessData {
  status: 'success';
  decodedLogs?: string; // External API always returns decoded logs
  result: string;
  requestId: string;
}

export type ActionRunListResponse = {
  items: ActionRunBase[];
  next: string;
};

export type ActionRunListItemResponse = ActionRunBase;
export type ActionRunResponse = ActionRunBase &
  (ActionRunPendingData | ActionRunErrorData | ActionRunSuccessData | ActionRunThrottledData);
export type ActionRunFinishedResponse = ActionRunBase & (ActionRunErrorData | ActionRunSuccessData);

export type ActionRunListParams = {
  next?: string;
  status?: ActionRunStatus | undefined;
};
