import { Network } from '@openzeppelin/defender-sdk-base-client';
import { MonitorConfirmation } from './monitor';
export interface BlockWatcherOptions {
  processBlockAttempts?: number;
  processBlockAttemptTimeoutMs?: number;
  processBlockBatchSize?: number;
  traceAttempts?: number;
  traceTimeoutMinTimeoutMs?: number;
  traceTimeoutMaxTimeoutMs?: number;
}

export interface BlockWatcher {
  blockWatcherId: string;
  network: Network;
  lastBlockNumber?: string;
  confirmLevel: MonitorConfirmation; // number of blocks in past to watch, 0 is latest (can be 'safe' or 'finalized' on PoS clients)
  lastUpdatedAt?: string;
  blockIntervalMs: number;
  paused?: boolean;
  traceBlock?: boolean;
  options?: BlockWatcherOptions;
}
