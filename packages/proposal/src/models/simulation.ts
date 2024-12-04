// Copied from openzeppelin/defender/models/src/types/simulation.res.d.ts


export type BigUInt = string | number;

export interface SimulationRequest {
  blockNumber?: BigUInt;
  transactionData: Transaction;
}
export interface Transaction {
  from?: string;
  to: string;
  data: string;
  value: BigUInt;
  gasPrice?: number;
  gas?: number;
  nonce?: number;
  maxFeePerGas?: number;
  maxPriorityFeePerGas?: number;
}


export interface SimulationResponse {
  summary: {
    network: string;
    blockNumber: number;
    totalCalls: number;
    cummulativeGasUsed: number;
    reverted: boolean;
    result?: string;
    revertReason?: string;
    events: IEvent[];
    contractStates: ContractState[];
    states: TraceRecordStateDiff[];
    transfers: TraceRecordTransaction[];
  };
  records: {
    index: number;
    transaction: TraceRecordTransaction;
    events?: IEvent[];
    states?: TraceRecordStateDiff[];
    status: {
      reverted: boolean;
      gasUsed: string;
      returnValue: string;
    };
    revertReason?: string;
  }[];
  contractProposalId: string;
  createdAt: string;
  error?: string;
}
export interface IEvent {
  address?: string;
  name: string;
  signature: string;
  topics: string[];
  args: EventArg[];
}
export interface EventArg {
  value: string | number | boolean | object;
  name: string;
  indexed: boolean;
  type: string;
}
export interface ContractState {
  address: string;
  states: {
    [k: string]: ContractStateValue;
  };
}
export interface ContractStateValue {
  types: string[];
  pre: string;
  post: string;
  changed: boolean;
}
export interface TraceRecordStateDiff {
  address: string;
  key: string;
  pre: string;
  post: string;
  changed: boolean;
}
export interface TraceRecordTransaction {
  type: 'CALL' | 'DELEGATECALL' | 'STATICCALL';
  data: string;
  from: string;
  to: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
  nonce?: string;
  blockNumber?: string;
  description?: {
    [k: string]: unknown;
  };
}
