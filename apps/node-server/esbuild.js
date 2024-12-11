const { build } = require('esbuild-wasm');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  sourcemap: true,
  outfile: 'dist/index.js',
}).catch(() => process.exit(1));