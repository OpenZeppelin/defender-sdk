# @openzeppelin/defender-sdk-monitor-client

## 2.7.0

### Minor Changes

- 31d5944: feat: Adding support for Sei chain.
  docs(proposals): Clarify distinction between Safe and Gnosis Multisig viaType options.

### Patch Changes

- Updated dependencies [31d5944]
  - @openzeppelin/defender-sdk-base-client@2.7.0

## 2.6.0

### Minor Changes

- b98eac5: feat: Remove Forta Integration

### Patch Changes

- Updated dependencies [b98eac5]
  - @openzeppelin/defender-sdk-base-client@2.6.0

## 2.5.0

### Minor Changes

- d2d4986: feat: Include deploy network type

### Patch Changes

- Updated dependencies [d2d4986]
  - @openzeppelin/defender-sdk-base-client@2.5.0

## 2.4.0

### Minor Changes

- b260a0c: feat: Add all input sources for dependency validation

### Patch Changes

- Updated dependencies [b260a0c]
  - @openzeppelin/defender-sdk-base-client@2.4.0

## 2.3.0

### Minor Changes

- e74b4c6: feat: Add Abstract network support.

### Patch Changes

- Updated dependencies [e74b4c6]
  - @openzeppelin/defender-sdk-base-client@2.3.0

## 2.2.0

### Minor Changes

- 625195d: feat: Add Unichain network.
  feat: Prevent sdk retries on 500 error.
  fix: Reading new env var for actions.

### Patch Changes

- Updated dependencies [625195d]
  - @openzeppelin/defender-sdk-base-client@2.2.0

## 2.1.0

### Minor Changes

- e22e31d: feat: add attribute to detect the deployment origin
  fix: client lambda dependencies with actions example

### Patch Changes

- Updated dependencies [e22e31d]
  - @openzeppelin/defender-sdk-base-client@2.1.0

## 2.0.0

### Major Changes

- c288762: feat(simulation): Update simulation models (breaking change).
  feat(network): Add geist network support.
  feat(deploy): Include immutable references in extracted artifact.
  docs(examples): Add new example to repo.

### Patch Changes

- Updated dependencies [c288762]
  - @openzeppelin/defender-sdk-base-client@2.0.0

## 1.15.2

### Patch Changes

- f65079b: feat: Create SDK API for listing permissions of current api key.
  feat: Support update deployments.
- Updated dependencies [f65079b]
  - @openzeppelin/defender-sdk-base-client@1.15.2

## 1.15.1

### Patch Changes

- c68c41a: feat: Add support for Actions high frequency intervals
  feat: Add support to approval process list
  feat:Add address book client methods
  fix: Upgrade web3 dependency to v4 in defender sdk
  feat: Predefine auth config type for relayer signer client
  feat: Add support to query transactions by nonce
  fix: Type inference in relay signer
  fix: Fix payload format for relay-signer
- Updated dependencies [c68c41a]
  - @openzeppelin/defender-sdk-base-client@1.15.1

## 1.15.0

### Minor Changes

- 302ea41: feat: Relayer groups support.
  fix(deploy): Include deployed bytecode to artifact.
  fix: Remove /v2 from basepath in most packages.

### Patch Changes

- Updated dependencies [302ea41]
  - @openzeppelin/defender-sdk-base-client@1.15.0

## 1.14.4

### Patch Changes

- 3a1d0f3: feat: Add missing dependencies that caused relay signer to fail.
  feat: Add support to isProduction flag for private networks.
  chore: Update transaction proposal route.
  feat: add support to deployment metadata.
  feat: add support for cancelling intents.
- Updated dependencies [3a1d0f3]
  - @openzeppelin/defender-sdk-base-client@1.14.4

## 1.14.3

### Patch Changes

- 19cd7a9: feat: Add relayers usage limiting
  feat: Add an example contract call
- Updated dependencies [19cd7a9]
  - @openzeppelin/defender-sdk-base-client@1.14.3

## 1.14.1

### Patch Changes

- 845d942: chore: fix vulnerabilities
  chore: Add utility for verifying webhooks signatures
  chore: Optimise api access by default
- Updated dependencies [845d942]
  - @openzeppelin/defender-sdk-base-client@1.14.1

## 1.14.0

### Minor Changes

- 164af52: chore: fix vulnerabilities
  chore: Add utility for verifying webhooks signatures
  chore: Optimise api access by default

### Patch Changes

- Updated dependencies [164af52]
  - @openzeppelin/defender-sdk-base-client@1.14.0

## 1.13.4

### Patch Changes

- 985443f: feat: add backwards compatibility to ethersv5
- Updated dependencies [985443f]
  - @openzeppelin/defender-sdk-base-client@1.13.4

## 1.13.3

### Patch Changes

- 2d1655d: feat: Add stackId in update relayer request
  feat: Add Auth v2 support with `useCredentialsCaching` to cache access token
- Updated dependencies [2d1655d]
  - @openzeppelin/defender-sdk-base-client@1.13.3

## 1.13.3

### Patch Changes

- e55d50a: Patch: Fix aws-sdk v3 action error payload
- Updated dependencies [e55d50a]
  - @openzeppelin/defender-sdk-base-client@1.13.3

## 1.13.0

### Minor Changes

- ff4a967: - feat: add exponential backoff logic for retry
  - fix: add conditional imports for v2 and v3 for actions
  - chore: add loadbalance example for rate limit number of transactions

### Patch Changes

- Updated dependencies [ff4a967]
  - @openzeppelin/defender-sdk-base-client@1.13.0

## 1.12.0

### Minor Changes

- 6b45bce: - feat: Support Holesky & Amoy networks.
  - chore: Add retries to 520 errors.
  - feat: Allow optional httpsAgent options.
  - fix: Avoid relaySigner ENS resolution by default.
  - chore: Upgrade dependencies.

### Patch Changes

- Updated dependencies [6b45bce]
  - @openzeppelin/defender-sdk-base-client@1.12.0

## 1.11.0

### Minor Changes

- 49c1994: refactor: Deprecate optimism-goerli network
  chore: Enable zkEVM networks
  chore: Upgrade npm packages

### Patch Changes

- Updated dependencies [49c1994]
  - @openzeppelin/defender-sdk-base-client@1.11.0

## 1.10.0

### Minor Changes

- 7e14499: fix: Add missing dependencies for cli tool to manage actions.
  fix: Add confirmation property to tx override.
  refactor: Remove deprecated config resources

### Patch Changes

- Updated dependencies [7e14499]
  - @openzeppelin/defender-sdk-base-client@1.10.0

## 1.9.0

### Minor Changes

- ed29a58: - chore: Autotask & actions condition names.
  - feat: Add Web3 & list contract examples.
  - feat: Add support to Zksync sepolia.
  - feat: Upgrade dependencies.

### Patch Changes

- Updated dependencies [ed29a58]
  - @openzeppelin/defender-sdk-base-client@1.9.0

## 1.8.0

### Minor Changes

- 688e4de: chore: Remove all non-required attributes from artifact
  feat: Add new private network endpoints
  feat: Add abi configuration for listing contracts
  chore: Add missing artifact attributes
  chore: Rename simulation transaction type
  chore: Add txOverrides parameter

### Patch Changes

- Updated dependencies [688e4de]
  - @openzeppelin/defender-sdk-base-client@1.8.0

## 1.7.0

### Minor Changes

- 97d593c: Feat: Add support to Base Sepolia & Optimism Sepolia networks.
  Feat: Add support to ethers v6

### Patch Changes

- Updated dependencies [97d593c]
  - @openzeppelin/defender-sdk-base-client@1.7.0

## 1.6.0

### Minor Changes

- 9583851: Feat: Support Arbitrum sepolia

### Patch Changes

- Updated dependencies [9583851]
  - @openzeppelin/defender-sdk-base-client@1.6.0

## 1.5.0

### Minor Changes

- 29be958: feat: add environment variable endpoints to actions
  feat: add meld network

### Patch Changes

- Updated dependencies [29be958]
  - @openzeppelin/defender-sdk-base-client@1.5.0

## 1.4.0

### Minor Changes

- c538fb7: - feat: Add support to scroll mainnet
  - feat: Added missing actions utilities
  - chore: Bump platform SDK dependencies

### Patch Changes

- Updated dependencies [c538fb7]
  - @openzeppelin/defender-sdk-base-client@1.4.0

## 1.3.0

### Minor Changes

- 001029a: - feat: add scroll sepolia network
  - feat: enforce base package to build first
  - feat: export created types
  - feat: changed sentinel attribute by monitor

### Patch Changes

- Updated dependencies [001029a]
  - @openzeppelin/defender-sdk-base-client@1.3.0

## 1.2.0

### Minor Changes

- 37edbc7: - feat: forked networks support
  - feat: network client
  - ci: security updates
  - fix: actions example

### Patch Changes

- Updated dependencies [37edbc7]
  - @openzeppelin/defender-sdk-base-client@1.2.0

## 1.1.0

### Minor Changes

- 0851ae2: - Fix: Create relayer key bug
  - Fix: Notification client typo
  - Fix: Patch security vulnerabilities

### Patch Changes

- Updated dependencies [0851ae2]
  - @openzeppelin/defender-sdk-base-client@1.1.0

## 1.0.0

### Major Changes

- 8711a12: - Migrate platform-sdk to defender-sdk

### Patch Changes

- Updated dependencies [8711a12]
  - @openzeppelin/defender-sdk-base-client@1.0.0

## 0.4.0

### Minor Changes

- be73034: Feat: Support linea & base

### Patch Changes

- Updated dependencies [be73034]
  - @openzeppelin/platform-sdk-base-client@0.4.0

## 0.3.0

### Minor Changes

- efefd68: feat: Add support of instantiating defender-sdk package from Platform Actions

### Patch Changes

- Updated dependencies [efefd68]
  - @openzeppelin/defender-sdk-base-client@0.3.0

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

### Patch Changes

- Updated dependencies [496f88d]
  - @openzeppelin/defender-sdk-base-client@0.2.0
