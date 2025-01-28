const { build } = require("esbuild-wasm");
const { sentryEsbuildPlugin } = require("@sentry/esbuild-plugin");

build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  sourcemap: true,
  outfile: "dist/index.js",
  plugins: [
    sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: "fixa-2r",
      project: "node-express",
    }),
  ],
}).catch((error) => {
  console.error(error);
  process.exit(1);
});
