# @openzeppelin/defender-sdk-example-create-monitor

## 2.6.0

### Minor Changes

- b98eac5: feat: Remove Forta Integration

### Patch Changes

- Updated dependencies [b98eac5]
  - @openzeppelin/defender-sdk@2.6.0

## 2.5.0

### Minor Changes

- d2d4986: feat: Include deploy network type

### Patch Changes

- Updated dependencies [d2d4986]
  - @openzeppelin/defender-sdk@2.5.0

## 2.4.0

### Minor Changes

- b260a0c: feat: Add all input sources for dependency validation

### Patch Changes

- Updated dependencies [b260a0c]
  - @openzeppelin/defender-sdk@2.4.0

## 2.3.0

### Minor Changes

- e74b4c6: feat: Add Abstract network support.

### Patch Changes

- Updated dependencies [e74b4c6]
  - @openzeppelin/defender-sdk@2.3.0

## 2.2.0

### Minor Changes

- 625195d: feat: Add Unichain network.
  feat: Prevent sdk retries on 500 error.
  fix: Reading new env var for actions.

### Patch Changes

- Updated dependencies [625195d]
  - @openzeppelin/defender-sdk@2.2.0

## 2.1.0

### Minor Changes

- e22e31d: feat: add attribute to detect the deployment origin
  fix: client lambda dependencies with actions example

### Patch Changes

- Updated dependencies [e22e31d]
  - @openzeppelin/defender-sdk@2.1.0

## 2.0.0

### Major Changes

- c288762: feat(simulation): Update simulation models (breaking change).
  feat(network): Add geist network support.
  feat(deploy): Include immutable references in extracted artifact.
  docs(examples): Add new example to repo.

### Patch Changes

- Updated dependencies [c288762]
  - @openzeppelin/defender-sdk@2.0.0

## 1.2.2

### Patch Changes

- f65079b: feat: Create SDK API for listing permissions of current api key.
  feat: Support update deployments.
- Updated dependencies [f65079b]
  - @openzeppelin/defender-sdk@1.15.2

## 1.2.1

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
  - @openzeppelin/defender-sdk@1.15.1

## 1.2.0

### Minor Changes

- 302ea41: feat: Relayer groups support.
  fix(deploy): Include deployed bytecode to artifact.
  fix: Remove /v2 from basepath in most packages.

### Patch Changes

- Updated dependencies [302ea41]
  - @openzeppelin/defender-sdk@1.15.0

## 1.1.3

### Patch Changes

- 3a1d0f3: feat: Add missing dependencies that caused relay signer to fail.
  feat: Add support to isProduction flag for private networks.
  chore: Update transaction proposal route.
  feat: add support to deployment metadata.
  feat: add support for cancelling intents.
- Updated dependencies [3a1d0f3]
  - @openzeppelin/defender-sdk@1.14.4

## 1.1.2

### Patch Changes

- 19cd7a9: feat: Add relayers usage limiting
  feat: Add an example contract call
- Updated dependencies [19cd7a9]
  - @openzeppelin/defender-sdk@1.14.3

## 1.1.1

### Patch Changes

- 845d942: chore: fix vulnerabilities
  chore: Add utility for verifying webhooks signatures
  chore: Optimise api access by default
- Updated dependencies [845d942]
  - @openzeppelin/defender-sdk@1.14.1

## 1.1.0

### Minor Changes

- 164af52: chore: fix vulnerabilities
  chore: Add utility for verifying webhooks signatures
  chore: Optimise api access by default

### Patch Changes

- Updated dependencies [164af52]
  - @openzeppelin/defender-sdk@1.14.0

## 1.0.0

### Major Changes

- 8711a12: - Migrate platform-sdk to defender-sdk

### Patch Changes

- Updated dependencies [8711a12]
  - @openzeppelin/defender-sdk@1.0.0

## 0.3.0

### Minor Changes

- be73034: Feat: Support linea & base

### Patch Changes

- Updated dependencies [be73034]
  - @openzeppelin/platform-sdk@0.4.0

## 0.2.1

### Patch Changes

- Updated dependencies [efefd68]
  - @openzeppelin/defender-sdk@0.3.0

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
  - @openzeppelin/defender-sdk@0.2.0
