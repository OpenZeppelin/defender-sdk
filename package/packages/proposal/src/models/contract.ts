import { Network } from '@openzeppelin/defender-sdk-base-client';
import { Address } from './proposal';

export interface Contract {
  network: Network;
  address: Address;
  name: string;
  abi?: string;
  natSpec?: string;
}
