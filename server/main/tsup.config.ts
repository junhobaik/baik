// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  minify: true,
  sourcemap: false,
  treeshake: true,
  splitting: false,
  bundle: true,
  dts: false,
  external: ['@aws-sdk/client-dynamodb', '@aws-sdk/client-s3', '@aws-sdk/lib-dynamodb', '@aws-sdk/util-dynamodb'],
  noExternal: ['uuid'],
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node20',
  banner: { js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);' },
});
