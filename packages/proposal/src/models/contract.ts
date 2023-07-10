import { Network } from '@openzeppelin/platform-sdk-base-client';
import { Address } from './proposal';

export interface Contract {
  network: Network;
  address: Address;
  name: string;
  abi?: string;
  natSpec?: string;
}
