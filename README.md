# <img src="logo.svg" alt="OpenZeppelin Defender V2 SDK Packages" height="40px">

<!-- TODO: Confirm these are all populating with data -->

[![NPM Package](https://img.shields.io/npm/v/@openzeppelin/defender-sdk.svg)](https://www.npmjs.org/package/@openzeppelin/defender-sdk)
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/OpenZeppelin/defender-sdk/badge)](https://api.securityscorecards.dev/projects/github.com/OpenZeppelin/defender-sdk)
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/7782/badge)](https://www.bestpractices.dev/projects/7782)
[![Scorecard supply-chain security](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/scorecard.yml/badge.svg)](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/scorecard.yml)
[![CI](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/OpenZeppelin/defender-sdk/actions/workflows/ci.yml)

## ⚠️ Important Notice

> **OpenZeppelin Defender will sunset on July 1, 2026. As a result, this SDK will be deprecated and will no longer receive updates after that date.**
>
> Users are encouraged to migrate to OpenZeppelin's open source projects, including [OpenZeppelin Relayer](https://github.com/OpenZeppelin/openzeppelin-relayer) and [OpenZeppelin Monitor](https://github.com/OpenZeppelin/openzeppelin-monitor). For detailed migration instructions and guidance, please follow the [Defender Migration Guide](https://docs.openzeppelin.com/defender/migration).
>
> **Note on OZ Monitor:** While this defender-sdk includes a Defender Monitor client, OpenZeppelin Monitor (the open source version) is a standalone binary/CLI tool and does not ship with a client SDK.
>
> **OpenZeppelin Relayer SDK:** For relayer functionality, use the new [OpenZeppelin Relayer SDK](https://github.com/OpenZeppelin/openzeppelin-relayer-sdk).

---

This monorepo contains individual OpenZeppelin Defender TypeScript clients and publishes the collection of clients as `@openzeppelin/defender-sdk`

## Usage

For detailed instructions on how to use the SDK, please refer to our [SDK Documentation](https://api-docs.defender.openzeppelin.com/).

## Development Setup

- `pnpm` for workspaces & dependency management.
- `nx` for build & tests.
- `changesets` for versioning, changelog management & publishing.

- Checkout the repo and run `pnpm i --ignore-scripts --prefer-offline && pnpm run build`.

  > Install pnpm globally with `npm i -g pnpm` if you haven't already.

- To skip cache on the subsequent build steps you can use `pnpm nx-build-skip-cache`.

## Testing

- Run `pnpm nx-test-skip-cache` to run unit tests across all packages.

## Linting & Styling

- Run `pnpm lint:check` or `pnpm prettier:check` at the project root. For fixing `pnpm lint:fix`

## Combining style, build & test in single command

- Run `pnpm nx-build-test-skip-cache`.

## Examples

The `examples` repo has sample code - note that most examples rely on `dotenv` for loading API keys and secrets.

## Lower Environments

You can set the following environment variables to control to which instance your client will connect to:

```bash
# all modules/clients besides relay signer
DEFENDER_API_URL=
DEFENDER_POOL_ID=
DEFENDER_POOL_CLIENT_ID=
# relay signer
DEFENDER_RELAY_SIGNER_API_URL=
DEFENDER_RELAY_SIGNER_POOL_ID=
DEFENDER_RELAY_SIGNER_POOL_CLIENT_ID=
```

---

### Determinstic Builds & Secure Publishes

- We use [slsa framework](https://slsa.dev/) _pronounced "salsa"_ for reproducible builds & secure pushes. Verification is done using [provenance](https://slsa.dev/provenance/v1)
