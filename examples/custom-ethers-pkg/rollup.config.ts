import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtins from 'builtin-modules';

/**
 * @template T
 * @param {{ default: T }} f
 * @see {@link https://github.com/rollup/plugins/issues/1541}
 */
const fixPluginTypeImport = (f) => /** @type {T} */ f;

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
  },
  plugins: [
    fixPluginTypeImport(json)({ compact: true }),
    fixPluginTypeImport(typescript)(),
    fixPluginTypeImport(resolve)({ preferBuiltins: true }),
  ],
  external: [
    ...builtins,
    'axios',
    /^@openzeppelin\/defender-(sdk|admin-client|autotask-client|autotask-utils|kvstore-client|relay-client|sentinel-client)/,
  ],
});
