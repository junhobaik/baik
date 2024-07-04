// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  minify: true,
  sourcemap: false,
  treeshake: true,
  splitting: true,
  bundle: true,
  dts: false,
  external: ['@aws-sdk/client-dynamodb', '@aws-sdk/client-s3', '@aws-sdk/lib-dynamodb', '@aws-sdk/util-dynamodb'],

  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'esnext',
  banner: { js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);' },
});
