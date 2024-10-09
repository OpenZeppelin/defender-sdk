export type AddressType =
  | 'EOA'
  | 'Contract'
  | 'Multisig'
  | 'Gnosis Safe'
  | 'Safe'
  | 'Gnosis Multisig'
  | 'Relayer'
  | 'Unknown'
  | 'Timelock Controller'
  | 'ERC20'
  | 'Governor'
  | 'Fireblocks';

export type AddressBookResponse = {
  addressBookId: string;
  address: string;
  network: string;
  type: AddressType;
  alias: string;
};

export type CreateAddressBookRequest = {
  address: string;
  network: string;
  type: AddressType;
  alias?: string;
  symbol?: string;
  decimals?: number;
};
