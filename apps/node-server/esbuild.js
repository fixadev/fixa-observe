const { build } = require('esbuild');
const { copy } = require('esbuild-plugin-copy');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: 'dist/index.js',
  plugins: [
    copy({
      assets: {
        from: ['../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/libquery_engine-*'],
        to: ['./'],
      },
    }),
  ],
});