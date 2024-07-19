import { existsSync } from 'fs';
import { ActionClient } from './api';
import {
  ActionRunErrorData,
  ActionRunListItemResponse,
  ActionRunStatus,
  ActionRunSuccessData,
} from './models/action-run.res';

/**
 * Regex Validator for Action and Action run IDs.
 */
export function validateId(id: string): void {
  const regex = /^[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}$/i;
  if (regex.test(id)) {
    return;
  } else {
    throw new Error(`invalid id '${id}'`);
  }
}

/**
 * Checks if path exists, otherwise throws an error.
 */
export function validatePath(path: string): void {
  if (existsSync(path)) {
    return;
  } else {
    throw new Error(`path ${path} does not exist`);
  }
}

export async function tailLogsFor(client: ActionClient, actionId: string) {
  try {
    validateId(actionId);
    console.warn(`\nPolling latest runs of action '${actionId}'...\n`);
    // Poll action runs every 2 seconds and if there are new runs, get run details and print them out.
    let lastRun: ActionRunListItemResponse | undefined;
    while (true) {
      const newRuns = await client.listActionRuns(actionId, {});
      // If cached last run id has changed
      if (newRuns.items[0]?.actionRunId !== lastRun?.actionRunId) {
        lastRun = newRuns.items[0]; // cache new last run to avoid duplicates.
        if (!lastRun) throw new Error('last run not found');

        const status = lastRun.status as ActionRunStatus;
        if (status === 'pending') {
          lastRun = undefined; // clean up so we can check it again on the next poll.
        } else if (status === 'error') {
          const runDetails = (await client.getActionRun(lastRun.actionRunId)) as ActionRunErrorData;
          console.log(`\nError: ${runDetails.message}`);
          runDetails.decodedLogs ? console.log(`\n${runDetails.decodedLogs}`) : console.log(`No logs available.`);
        } else if (status === 'success') {
          const runDetails = (await client.getActionRun(lastRun.actionRunId)) as ActionRunSuccessData;
          console.log(`\n${runDetails.decodedLogs}`);
        } else if (status === 'throttled') {
          console.warn(
            `\nThis action run was canceled since the hourly run capacity for your account has been exceeded. Contact us at defender-support@openzeppelin.com for additional capacity.`,
          );
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  } catch (e) {
    throw e;
  }
}

/**
 * Verifies that the environment variables are present and initializes the client.
 * @returns The initialized client instance.
 */
export function initClient(): ActionClient {
  const { API_KEY: apiKey, API_SECRET: apiSecret } = process.env;
  if (!apiKey || !apiSecret) throw new Error(`API_KEY or API_SECRET env vars are missing`);
  const client = new ActionClient({ apiKey, apiSecret });
  return client;
}
