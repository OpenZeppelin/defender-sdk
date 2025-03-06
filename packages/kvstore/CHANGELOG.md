# @openzeppelin/defender-sdk-key-value-store-client

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
