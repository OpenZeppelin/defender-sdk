# Defender Action with Custom Ethers Package Using Rollup

This folder shows how to code an Action with package dependencies not available in the Action runtime, by generating a bundle using [Rollup](https://rollupjs.org/) that includes all dependencies, along with imported ABIs so they don't have to be copied into the script. This example uses typescript, but is also applicable to javascript.

## Setup

The `rollup.config.js` file instructs Rollup to output a single file to `dist/index.js` based on the `src/index.ts` input file. All dependencies tagged as `external` will not be included in the bundle, since they are available in the Action environment - other dependencies, such as `ethers` in the example, will be embedded in it.

Run `npm run build` to have Rollup generate the `dist/index.js` file, and copy it into your Action.

## Running Locally

You can run the scripts locally, instead of in an Action, via a Defender Relayer. Create a Defender Relayer on sepolia, write down the relayer api key and secret, and create a `.env` file in this folder with the following content:

```
RELAYER_API_KEY=yourapikey
RELAYER_API_SECRET=yourapisecret
```

Then run `npm run build` to compile your script, and `npm run start` to run your script locally, connecting to your Relay via the Defender API.
