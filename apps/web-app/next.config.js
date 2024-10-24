/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  images: {
    domains: ["newmark.s3.us-east-1.amazonaws.com", "www.fratantoniluxuryestates.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "pixa-real-estate.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "newmark.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "newmark.s3.us-east-1.amazonaws.com",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@react-pdf/renderer"],
  },
};

export default config;
