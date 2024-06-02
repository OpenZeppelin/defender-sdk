import { Defender, type DefenderOptions } from '@openzeppelin/defender-sdk';
import { type ActionEvent } from '@openzeppelin/defender-sdk-action-client';
import { ContractFactory } from 'ethers';
import ERC20Abi from '../erc20.json';
import ERC20Bytecode from '../bytecode.json';
import { fileURLToPath } from 'node:url';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

export async function handler(event: ActionEvent | DefenderOptions) {
  console.log(ethers.version);

  const client = new Defender(event as DefenderOptions);
  const provider = client.relaySigner.getProvider();
  const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

  const erc20BytesLike = ERC20Bytecode[0].data.bytecode.object;
  const factory = new ContractFactory(ERC20Abi, erc20BytesLike, signer);

  console.log(`Deploying ERC20 contract`);
  const erc20 = await factory.deploy(100, { gasLimit: 8000000 });

  console.log(`Waiting for contract deployment...`);
  await erc20.deploymentTransaction().wait();

  const contractAddress = await erc20.getAddress();
  console.log(`Contract deployed at address ${contractAddress}`);
  return 0;
}

type Credentials = {
  RELAYER_API_KEY: string;
  RELAYER_API_SECRET: string;
};

// To run locally (this code will not be executed in Autotasks)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  dotenv.config();

  const { RELAYER_API_KEY: relayerApiKey, RELAYER_API_SECRET: relayerApiSecret } = process.env as Credentials;

  // Call handler function
  handler({ relayerApiKey, relayerApiSecret })
    .then(() => process.exit(0))
    .catch((error: Error) => {
      console.error(error);
      process.exit(1);
    });
}
