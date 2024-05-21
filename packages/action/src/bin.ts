#!/usr/bin/env node
import { AxiosError } from 'axios';
import 'dotenv/config';
import { argv } from 'process';
import { VERSION } from '.';
import { initClient, tailLogsFor, validateId, validatePath } from './utils';

type Command = 'update-code' | 'tail-runs' | 'execute-run';

function printUsage(dueToError = true) {
  if (dueToError) {
    console.error(`\ndefender-action-client: Command not found or wrong parameters provided!\n`);
  }
  console.error(`Defender Action Client (version ${VERSION})\n`);
  console.error('Usage: defender-action update-code $ACTION_ID $PATH');
  console.error('\nExample:\n  defender-action update-code 19ef0257-bba4-4723-a18f-67d96726213e ./lib/action\n');
  console.error('Usage: defender-action tail-runs $ACTION_ID');
  console.error('\nExample:\n  defender-action tail-runs 19ef0257-bba4-4723-a18f-67d96726213e\n');
  console.error('Usage: defender-action execute-run $ACTION_ID');
  console.error('\nExample:\n  defender-action execute-run 19ef0257-bba4-4723-a18f-67d96726213e\n');
}

/**
 * Makes sure that mandatory params for the given command are present.
 * @param command The command to validate.
 */
function mandatoryParamGuard(command: Command) {
  switch (command) {
    case 'update-code':
      if (!argv[3] || !argv[4]) {
        printUsage();
        process.exit(1);
      }
      break;
    // Same requirements for now
    case 'tail-runs':
    case 'execute-run':
      if (!argv[3]) {
        printUsage();
        process.exit(1);
      }
      break;
    default:
      printUsage();
      process.exit(1);
  }
}

/* -------------------------------- Commands -------------------------------- */

/**
 * Utilizes the Actions API to update the code of a given action.
 */
async function updateCode() {
  const actionId = argv[3] as string;
  const path = argv[4] as string;
  try {
    validateId(actionId);
    validatePath(path);

    const client = initClient();
    console.error(`Uploading code for action ${actionId} from ${path}...`);
    await client.updateCodeFromFolder(actionId, { path });
  } catch (error) {
    const err = error as Error | AxiosError;
    console.error(`Error updating Action code: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Utilizes the Action API to poll for new runs and print them out.
 */
async function tailRuns() {
  const actionId = argv[3] as string;
  try {
    await tailLogsFor(initClient(), actionId);
  } catch (e) {
    const err = e as Error | AxiosError;
    console.error(`Error on listening to Action runs: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Utilizes the Action API to trigger action run manually.
 */
async function executeRun() {
  const actionId = argv[3] as string;
  try {
    validateId(actionId);
    const client = initClient();
    console.warn(`Executing action run for action '${actionId}'...`);
    const resp = await client.runAction(actionId, {});
    console.warn(`Successfully executed action run for autotask '${actionId}'`);
    console.warn(`Run ID: ${resp.actionRunId}, \nStatus: ${resp.status}`);
    console.warn(`Tip: Call 'defender-action tail-runs ${actionId}' to follow the runs.`);
  } catch (error) {
    const err = error as Error | AxiosError;
    console.error(`Error executing action run: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  mandatoryParamGuard(argv[2] as Command);

  switch (argv[2]) {
    case 'update-code':
      await updateCode();
      break;
    case 'tail-runs':
      await tailRuns();
      break;
    case 'execute-run':
      await executeRun();
      break;
    default:
      throw new Error(`unhandled command '${argv[2]}'. Make sure your 'mandatoryParamGuard' handles this command.`);
  }
}

main();
