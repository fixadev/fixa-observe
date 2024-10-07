import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CLERK_SECRET_KEY: z.string(),
    CLERK_WEBHOOK_SECRET: z.string(),
    LISTMONK_USERNAME: z.string(),
    LISTMONK_PASSWORD: z.string(),
    LISTMONK_URL: z.string().url(),
    LISTMONK_LIST_ID: z.number(),
    ANTHROPIC_KEY: z.string(),
    // Temporarily disabled Discord auth functionality
    // DISCORD_CLIENT_ID: z.string(),
    // DISCORD_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
    NEXT_PUBLIC_BACKEND_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    LISTMONK_USERNAME: process.env.LISTMONK_USERNAME,
    LISTMONK_PASSWORD: process.env.LISTMONK_PASSWORD,
    LISTMONK_URL: process.env.LISTMONK_URL,
    LISTMONK_LIST_ID: parseInt(process.env.LISTMONK_LIST_ID ?? "0"),
    ANTHROPIC_KEY: process.env.ANTHROPIC_KEY,
    // Temporarily disabled Discord auth functionality
    // DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    // DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
