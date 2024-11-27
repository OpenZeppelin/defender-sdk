import { findKey } from 'lodash';

export type Network = SupportedNetwork | TenantNetwork;
export type SupportedNetwork = PublicNetwork | CustomNetwork;
export type PublicNetwork =
  | 'alfajores'
  | 'amoy'
  | 'arbitrum-nova'
  | 'arbitrum-sepolia'
  | 'arbitrum'
  | 'aurora'
  | 'auroratest'
  | 'avalanche'
  | 'base-sepolia'
  | 'base'
  | 'bsc'
  | 'bsctest'
  | 'celo'
  | 'fantom'
  | 'fantomtest'
  | 'fuji'
  | 'fuse'
  | 'geist-polter'
  | 'geist-mainnet'
  | 'hedera'
  | 'hederatest'
  | 'holesky'
  | 'japan-testnet'
  | 'japan'
  | 'linea-goerli'
  | 'linea-sepolia'
  | 'linea'
  | 'mainnet'
  | 'mantle-sepolia'
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
  | 'unichain-sepolia'
  | 'xdai'
  | 'zksync-sepolia'
  | 'zksync';
export type CustomNetwork = 'x-dfk-avax-chain' | 'x-dfk-avax-chain-test' | 'x-security-alliance';
export type TenantNetwork = string;

export const Networks: Network[] = [
  'alfajores',
  'amoy',
  'arbitrum-nova',
  'arbitrum-sepolia',
  'arbitrum',
  'aurora',
  'auroratest',
  'avalanche',
  'base-sepolia',
  'base',
  'bsc',
  'bsctest',
  'celo',
  'fantom',
  'fantomtest',
  'fuji',
  'fuse',
  'geist-polter',
  'geist-mainnet',
  'hedera',
  'hederatest',
  'holesky',
  'japan-testnet',
  'japan',
  'linea-goerli',
  'linea-sepolia',
  'linea',
  'mainnet',
  'mantle-sepolia',
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
  'unichain-sepolia',
  'x-dfk-avax-chain-test',
  'x-dfk-avax-chain',
  'x-security-alliance',
  'xdai',
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

export const chainIds: { [key in Network]: number } = {
  'alfajores': 44787,
  'amoy': 80002,
  'arbitrum': 42161,
  'arbitrum-nova': 42170,
  'arbitrum-sepolia': 421614,
  'aurora': 1313161554,
  'auroratest': 1313161555,
  'avalanche': 43114,
  'base': 8453,
  'base-sepolia': 84532,
  'bsc': 56,
  'bsctest': 97,
  'celo': 42220,
  'fantom': 250,
  'fantomtest': 4002,
  'fuji': 43113,
  'fuse': 122,
  'geist-polter': 631571,
  'geist-mainnet': 63157,
  'hedera': 295,
  'hederatest': 296,
  'holesky': 17000,
  'japan': 81,
  'japan-testnet': 10081,
  'linea': 59144,
  'linea-goerli': 59140,
  'linea-sepolia': 59141,
  'mainnet': 1,
  'mantle': 5000,
  'mantle-sepolia': 5003,
  'matic': 137,
  'matic-zkevm': 1101,
  'matic-zkevm-testnet': 1442,
  'meld': 333000333,
  'meld-kanazawa': 222000222,
  'moonbase': 1287,
  'moonbeam': 1284,
  'moonriver': 1285,
  'mumbai': 80001,
  'optimism': 10,
  'optimism-sepolia': 11155420,
  'scroll': 534352,
  'scroll-sepolia': 534351,
  'sepolia': 11155111,
  'sokol': 77,
  'unichain-sepolia': 1301,
  'x-dfk-avax-chain': 53935,
  'x-dfk-avax-chain-test': 335,
  'x-security-alliance': 888,
  'xdai': 100,
  'zksync': 324,
  'zksync-sepolia': 300,
};
