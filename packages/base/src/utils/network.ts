import { findKey } from 'lodash';

export type Network = SupportedNetwork | TenantNetwork;
export type SupportedNetwork = PublicNetwork | CustomNetwork;
export type PublicNetwork =
  | 'alfajores'
  | 'amoy'
  | 'arbitrum-goerli'
  | 'arbitrum-nova'
  | 'arbitrum-sepolia'
  | 'arbitrum'
  | 'aurora'
  | 'auroratest'
  | 'avalanche'
  | 'base-goerli'
  | 'base-sepolia'
  | 'base'
  | 'bsc'
  | 'bsctest'
  | 'celo'
  | 'fantom'
  | 'fantomtest'
  | 'fuji'
  | 'fuse'
  | 'goerli'
  | 'harmony-s0'
  | 'harmony-test-s0'
  | 'hedera'
  | 'hederatest'
  | 'holesky'
  | 'linea-goerli'
  | 'linea'
  | 'mainnet'
  | 'mantle'
  | 'matic-zkevm-testnet'
  | 'matic-zkevm'
  | 'matic'
  | 'meld-kanazawa'
  | 'meld'
  | 'moonbase'
  | 'moonbeam'
  | 'moonriver'
  | 'mumbai'
  | 'optimism-sepolia'
  | 'optimism'
  | 'scroll-sepolia'
  | 'scroll'
  | 'sepolia'
  | 'sokol'
  | 'xdai'
  | 'zksync-goerli'
  | 'zksync-sepolia'
  | 'zksync';
export type CustomNetwork = 'x-dfk-avax-chain' | 'x-dfk-avax-chain-test' | 'x-security-alliance';
export type TenantNetwork = string;

export const Networks: Network[] = [
  'alfajores',
  'amoy',
  'arbitrum-goerli',
  'arbitrum-nova',
  'arbitrum-sepolia',
  'arbitrum',
  'aurora',
  'auroratest',
  'avalanche',
  'base-goerli',
  'base-sepolia',
  'base',
  'bsc',
  'bsctest',
  'celo',
  'fantom',
  'fantomtest',
  'fuji',
  'fuse',
  'goerli',
  'harmony-s0',
  'harmony-test-s0',
  'hedera',
  'hederatest',
  'holesky',
  'linea-goerli',
  'linea',
  'mainnet',
  'mantle',
  'matic-zkevm-testnet',
  'matic-zkevm',
  'matic',
  'meld-kanazawa',
  'meld',
  'moonbase',
  'moonbeam',
  'moonriver',
  'mumbai',
  'optimism-sepolia',
  'optimism',
  'scroll-sepolia',
  'scroll',
  'sepolia',
  'sokol',
  'x-dfk-avax-chain-test',
  'x-dfk-avax-chain',
  'x-security-alliance',
  'xdai',
  'zksync-goerli',
  'zksync-sepolia',
  'zksync',
];

export function isValidNetwork(text: string): text is Network {
  return (Networks as string[]).includes(text);
}

export function fromChainId(chainId: number): Network | undefined {
  return findKey(chainIds, (number) => number === chainId) as Network | undefined;
}

export function toChainId(network: Network): number | undefined {
  return chainIds[network];
}

const chainIds: { [key in Network]: number } = {
  'alfajores': 44787,
  'amoy': 80002,
  'arbitrum-goerli': 421613,
  'arbitrum-nova': 42170,
  'arbitrum-sepolia': 421614,
  'arbitrum': 42161,
  'aurora': 1313161554,
  'auroratest': 1313161555,
  'avalanche': 0xa86a,
  'base-goerli': 84531,
  'base-sepolia': 84532,
  'base': 8453,
  'bsc': 56,
  'bsctest': 97,
  'celo': 42220,
  'fantom': 250,
  'fantomtest': 0xfa2,
  'fuji': 0xa869,
  'fuse': 122,
  'goerli': 5,
  'harmony-s0': 1666600000,
  'harmony-test-s0': 1666700000,
  'hedera': 295,
  'hederatest': 296,
  'holesky': 17000,
  'linea-goerli': 59140,
  'linea': 59144,
  'mainnet': 1,
  'mantle': 5000,
  'matic-zkevm-testnet': 1442,
  'matic-zkevm': 1101,
  'matic': 137,
  'meld-kanazawa': 0xd3b745e,
  'meld': 0x13d92e8d,
  'moonbase': 1287,
  'moonbeam': 1284,
  'moonriver': 1285,
  'mumbai': 80001,
  'optimism-sepolia': 11155420,
  'optimism': 10,
  'scroll-sepolia': 534351,
  'scroll': 534352,
  'sepolia': 11155111,
  'sokol': 77,
  'x-dfk-avax-chain-test': 335,
  'x-dfk-avax-chain': 53935,
  'x-security-alliance': 888,
  'xdai': 100,
  'zksync-goerli': 280,
  'zksync-sepolia': 300,
  'zksync': 324,
};
