# Platform Packages

<!-- TODO: Confirm these are all populating with data -->

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/OpenZeppelin/platform-sdk/badge)](https://api.securityscorecards.dev/projects/github.com/OpenZeppelin/platform-sdk)
[![OpenSSF Best Practices](https://bestpractices.coreinfrastructure.org/projects/7395/badge)](https://bestpractices.coreinfrastructure.org/projects/7395)
[![Scorecard supply-chain security](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/scorecard.yml/badge.svg)](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/scorecard.yml)
[![Stable Git Release](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/stable.yml/badge.svg)](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/stable.yml)
[![RC Git Release](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/rc.yml/badge.svg)](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/rc.yml)
[![CI](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/OpenZeppelin/platform-sdk/actions/workflows/ci.yml)

This monorepo contains individual OpenZeppelin Platform TypeScript clients and publishes the collection of clients as `@openzeppelin/platform-sdk`

## Development Setup

- Checkout the repo and run `pnpm i --ignore-scripts --prefer-offline && pnpm run build`.

  > Install pnpm globally with `npm i -g pnpm` if you haven't already.

- To skip cache on the subsequent build steps you can use `pnpm nx-build-skip-cache`.

## Testing

Run `npm test` to run unit tests across all packages.

## Linting

Run `npm run lint` at the project root.

## Publish

<!-- TODO: define publish steps re Github CI - this section could be deleted if we want to just document this internally -->

## Examples

The `examples` repo has sample code - note that most examples rely on `dotenv` for loading API keys and secrets.

## Lower Environments

You can set the following environment variables to control to which instance your client will connect to:

```bash
# all modules/clients besides relay signer
PLATFORM_API_URL=
PLATFORM_POOL_ID=
PLATFORM_CLIENT_ID=
# relay signer
RELAY_SIGNER_API_URL=
RELAY_SIGNER_POOL_ID=
RELAY_SIGNER_POOL_CLIENT_ID=
```

---

### CI/CD

<!-- TODO: once we have CI/CD steps fully defined we should validate this is accurate -->

- We use github actions for CI/CD. See [workflows](.github/workflows) for more info.
  - `ci.yml` - runs on every push to any branch --> runs tests.
  - `rc.yml` - runs on every push to master --> creates a rc tag --> creates a pre-release draft.
  - `stable.yml` - Manual trigger workflow --> creates a stable tag --> creates a latest release --> publishes to npm.
  - `release.yml` - Manual trigger workflow --> create a git release for a given tag.
  - `publish.yml` - Manual trigger workflow ( for any given tag ) --> publishes to npm.

---

### Determinstic Builds & Secure Publishes

- We use [slsa framework](https://slsa.dev/) _pronounced "salsa"_ for reproducible builds & secure pushes. Verification is done using [provenance](https://slsa.dev/provenance/v1)
