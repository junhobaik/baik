// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  minify: false,
  sourcemap: true,
  treeshake: false,
  splitting: false,
  bundle: true,
  dts: false,
  noExternal: [/(.*)/],
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm'],
  target: 'node20',
  banner: { js: 'import { createRequire } from "module";const require = createRequire(import.meta.url);' },
});
