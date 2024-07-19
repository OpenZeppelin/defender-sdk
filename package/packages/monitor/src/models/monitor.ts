export type MonitorConfirmation = number | 'safe' | 'finalized';
export type ExternalCreateMonitorRequest = ExternalCreateBlockMonitorRequest | ExternalCreateFortaMonitorRequest;

export type ExternalUpdateMonitorRequest = ExternalUpdateBlockMonitorRequest | ExternalUpdateFortaMonitorRequest;
export interface ExternalBaseCreateMonitorRequest {
  name: string;
  addresses?: string[];
  type: 'FORTA' | 'BLOCK';
  notificationChannels: string[];
  abi?: string;
  paused?: boolean;
  alertThreshold?: Threshold;
  actionCondition?: string;
  actionTrigger?: string;
  alertTimeoutMs?: number;
  alertMessageBody?: string;
  alertMessageSubject?: string;
  severityLevel?: NotificationSeverityLevel;
  riskCategory?: MonitorRiskCategory;
  stackResourceId?: string;
}
export interface ExternalCreateBlockMonitorRequest extends ExternalBaseCreateMonitorRequest {
  network: Network;
  confirmLevel?: MonitorConfirmation; // blockWatcherId
  addresses: string[];
  abi?: string;
  skipABIValidation?: boolean;
  eventConditions?: EventCondition[];
  functionConditions?: FunctionCondition[];
  txCondition?: string;
  type: 'BLOCK';
}

export interface ExternalCreateFortaMonitorRequest extends ExternalBaseCreateMonitorRequest {
  privateFortaNodeId?: string;
  network?: Network;
  fortaLastProcessedTime?: string;
  addresses?: Address[];
  // Forta have changed the terminology for 'Agent' to 'Detection Bot'
  // We will continue to refer to them as 'Agent' for now.
  // agentIDs should be a list of Bot IDs
  agentIDs?: string[];
  fortaConditions: FortaConditionSet;
  type: 'FORTA';
}
export interface ExternalUpdateBlockMonitorRequest
  extends Omit<ExternalCreateBlockMonitorRequest, 'network' | 'addresses' | 'name' | 'notificationChannels'> {
  monitorId: string;
  network?: Network;
  addresses?: string[];
  name?: string;
  notificationChannels?: string[];
}

export interface ExternalUpdateFortaMonitorRequest
  extends Omit<ExternalCreateFortaMonitorRequest, 'fortaConditions' | 'name' | 'notificationChannels'> {
  monitorId: string;
  fortaConditions?: FortaConditionSet;
  name?: string;
  notificationChannels?: string[];
}

export type CreateMonitorRequest = CreateBlockMonitorRequest | CreateFortaMonitorRequest;

// Copied from openzeppelin/defender/models/src/types/subscribers.req.d.ts

import { Network } from '@openzeppelin/defender-sdk-base-client';
import { NotificationType } from './notification';

export interface BaseCreateMonitorRequest {
  name: string;
  paused: boolean;
  skipABIValidation?: boolean;
  alertThreshold?: Threshold;
  notifyConfig?: Notifications;
  riskCategory?: MonitorRiskCategory;
  stackResourceId?: string;
}

export interface BaseCreateMonitorResponse extends BaseCreateMonitorRequest {
  monitorId: string;
  createdAt?: string;
}

export interface PartialCreateFortaMonitorRequest {
  privateFortaNodeId?: string;
  fortaRule: FortaRule;
  network?: Network;
  type: 'FORTA';
}

export interface PartialCreateBlockMonitorRequest {
  addressRules: AddressRule[];
  blockWatcherId: string;
  network: Network;
  type: 'BLOCK';
  skipABIValidation?: boolean;
}

export interface CreateBlockMonitorRequest extends BaseCreateMonitorRequest, PartialCreateBlockMonitorRequest {}

export interface CreateFortaMonitorRequest extends BaseCreateMonitorRequest, PartialCreateFortaMonitorRequest {}

export interface CreateFortaMonitorResponse extends BaseCreateMonitorResponse, CreateFortaMonitorRequest {
  fortaLastProcessedTime?: string;
}

export interface CreateBlockMonitorResponse extends BaseCreateMonitorResponse, CreateBlockMonitorRequest {}

export interface FortaRule {
  addresses?: Address[];
  // Forta have changed the terminology for 'Agent' to 'Detection Bot'
  // We will continue to refer to them as 'Agent' for now.
  // agentIDs should be a list of Bot IDs
  agentIDs?: string[];
  conditions: FortaConditionSet;
  actionCondition?: ActionCondition;
}
export interface FortaConditionSet {
  alertIDs?: string[];
  minimumScannerCount: number;
  severity?: number;
}

export enum MonitorType {
  BLOCK = 'BLOCK',
  FORTA = 'FORTA',
}

export type MonitorRiskCategory = 'NONE' | 'GOVERNANCE' | 'ACCESS-CONTROL' | 'SUSPICIOUS' | 'FINANCIAL' | 'TECHNICAL';
export type NotificationSeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Address = string;
export interface AddressRule {
  conditions: ConditionSet[];
  actionCondition?: ActionCondition;
  addresses: Address[];
  abi?: string;
}
export interface ConditionSet {
  eventConditions: EventCondition[];
  txConditions: TxCondition[];
  functionConditions: FunctionCondition[];
}
export interface EventCondition {
  eventSignature: string;
  expression?: string | null;
}
export interface TxCondition {
  status: 'success' | 'failed' | 'any';
  expression?: string | null;
}
export interface FunctionCondition {
  functionSignature: string;
  expression?: string | null;
}
export interface ActionCondition {
  actionId: string;
}
export interface Threshold {
  amount: number;
  windowSeconds: number;
}
export interface Notifications {
  notifications: NotificationReference[];
  severityLevel?: NotificationSeverityLevel;
  actionId?: string;
  messageBody?: string;
  messageSubject?: string;
  timeoutMs: number;
}
export interface NotificationReference {
  notificationId: string;
  type: NotificationType;
  [k: string]: unknown;
}

// Copied from ui/src/components/monitor/types.ts

import { EventFragment, FunctionFragment } from 'ethers';

export type Description = EventFragment | FunctionFragment;
export type Condition = EventCondition | FunctionCondition | undefined;

export interface Conditions {
  txExpression: string;
  events: ConditionField[];
  functions: ConditionField[];
}
export interface ConditionField {
  description: Description;
  signature: string;
  inputs: (string | undefined)[];
  expression: string;
  selected: boolean;
}
