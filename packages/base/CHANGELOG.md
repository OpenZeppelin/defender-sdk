# @openzeppelin/defender-sdk-base-client

## 1.14.1

### Patch Changes

- 845d942: chore: fix vulnerabilities
  chore: Add utility for verifying webhooks signatures
  chore: Optimise api access by default

## 1.14.0

### Minor Changes

- 164af52: chore: fix vulnerabilities
  chore: Add utility for verifying webhooks signatures
  chore: Optimise api access by default

## 1.13.4

### Patch Changes

- 985443f: feat: add backwards compatibility to ethersv5

## 1.13.3

### Patch Changes

- 2d1655d: feat: Add stackId in update relayer request
  feat: Add Auth v2 support with `useCredentialsCaching` to cache access token

## 1.13.3

### Patch Changes

- e55d50a: Patch: Fix aws-sdk v3 action error payload

## 1.13.0

### Minor Changes

- ff4a967: - feat: add exponential backoff logic for retry
  - fix: add conditional imports for v2 and v3 for actions
  - chore: add loadbalance example for rate limit number of transactions

## 1.12.0

### Minor Changes

- 6b45bce: - feat: Support Holesky & Amoy networks.
  - chore: Add retries to 520 errors.
  - feat: Allow optional httpsAgent options.
  - fix: Avoid relaySigner ENS resolution by default.
  - chore: Upgrade dependencies.

## 1.11.0

### Minor Changes

- 49c1994: refactor: Deprecate optimism-goerli network
  chore: Enable zkEVM networks
  chore: Upgrade npm packages

## 1.10.0

### Minor Changes

- 7e14499: fix: Add missing dependencies for cli tool to manage actions.
  fix: Add confirmation property to tx override.
  refactor: Remove deprecated config resources

## 1.9.0

### Minor Changes

- ed29a58: - chore: Autotask & actions condition names.
  - feat: Add Web3 & list contract examples.
  - feat: Add support to Zksync sepolia.
  - feat: Upgrade dependencies.

## 1.8.0

### Minor Changes

- 688e4de: chore: Remove all non-required attributes from artifact
  feat: Add new private network endpoints
  feat: Add abi configuration for listing contracts
  chore: Add missing artifact attributes
  chore: Rename simulation transaction type
  chore: Add txOverrides parameter

## 1.7.0

### Minor Changes

- 97d593c: Feat: Add support to Base Sepolia & Optimism Sepolia networks.
  Feat: Add support to ethers v6

## 1.6.0

### Minor Changes

- 9583851: Feat: Support Arbitrum sepolia

## 1.5.0

### Minor Changes

- 29be958: feat: add environment variable endpoints to actions
  feat: add meld network

## 1.4.0

### Minor Changes

- c538fb7: - feat: Add support to scroll mainnet
  - feat: Added missing actions utilities
  - chore: Bump platform SDK dependencies

## 1.3.0

### Minor Changes

- 001029a: - feat: add scroll sepolia network
  - feat: enforce base package to build first
  - feat: export created types
  - feat: changed sentinel attribute by monitor

## 1.2.0

### Minor Changes

- 37edbc7: - feat: forked networks support
  - feat: network client
  - ci: security updates
  - fix: actions example

## 1.1.0

### Minor Changes

- 0851ae2: - Fix: Create relayer key bug
  - Fix: Notification client typo
  - Fix: Patch security vulnerabilities

## 1.0.0

### Major Changes

- 8711a12: - Migrate platform-sdk to defender-sdk

## 0.4.0

### Minor Changes

- be73034: Feat: Support linea & base

## 0.3.0

### Minor Changes

- efefd68: feat: Add support of instantiating defender-sdk package from Platform Actions

## 0.2.0

### Minor Changes

- 496f88d: ### CHANGES

  - feat: list network endpoints
  - ci: fix ci bugs
  - fix: type with actionId
  - feat: add support to base mainnet
  - feat: add `skipABIValidation` flag to monitor create request
  - ci: add changeset actions
  - ci: remove provenance
