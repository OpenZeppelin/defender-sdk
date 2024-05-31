import { Defender, DefenderOptions } from '@openzeppelin/defender-sdk';
import { ActionEvent } from '@openzeppelin/defender-sdk-action-client';
import { ContractFactory } from 'ethers';
import ERC20Abi from '../erc20.json';
import ERC20Bytecode from '../bytecode.json';

export async function handler(event: ActionEvent & DefenderOptions) {
  const client = new Defender(event);
  const provider = client.relaySigner.getProvider();
  const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });

  const erc20BytesLike = ERC20Bytecode[0].data.bytecode.object;

  // Deploy new ERC20 contract
  const factory = new ContractFactory(ERC20Abi, erc20BytesLike, signer);

  // console.log(`Deploying ERC20 contract`);
  // const erc20 = await factory.deploy(100, { gasLimit: 8000000 });

  // console.log(`Waiting for contract deployment...`);
  // await erc20.deploymentTransaction().wait();

  // const contractAddress = await erc20.getAddress();
  // console.log(`Contract deployed at address ${contractAddress}`);
  return {};
}

// To run locally (this code will not be executed in Autotasks)
if (require.main === module) {
  // Create DefenderOptions object from process.env values
  // Call handler function
}
