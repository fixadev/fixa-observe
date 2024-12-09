import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Function to check missing environment variables
const checkMissingEnvVars = () => {
  const serverVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    LISTMONK_USERNAME: process.env.LISTMONK_USERNAME,
    LISTMONK_PASSWORD: process.env.LISTMONK_PASSWORD,
    LISTMONK_URL: process.env.LISTMONK_URL,
    LISTMONK_LIST_ID: process.env.LISTMONK_LIST_ID,
    ANTHROPIC_KEY: process.env.ANTHROPIC_KEY,
    OPENAI_KEY: process.env.OPENAI_KEY,
    GCLOUD_CREDS: process.env.GCLOUD_CREDS,
    RETELL_API_KEY: process.env.RETELL_API_KEY,
    VAPI_API_KEY: process.env.VAPI_API_KEY,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
  };

  const clientVars = {
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SLACK_CLIENT_ID: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
    NEXT_PUBLIC_SLACK_REDIRECT_URI: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
  };

  console.log("\nChecking environment variables...");
  
  console.log("\nServer-side variables:");
  Object.entries(serverVars).forEach(([key, value]) => {
    if (!value) console.log(`❌ Missing: ${key}`);
  });

  console.log("\nClient-side variables:");
  Object.entries(clientVars).forEach(([key, value]) => {
    if (!value) console.log(`❌ Missing: ${key}`);
  });
  
  console.log("\n");
};

// Run the check before creating the env object
checkMissingEnvVars();

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
    OPENAI_KEY: z.string(),
    GCLOUD_CREDS: z.string(),
    RETELL_API_KEY: z.string(),
    VAPI_API_KEY: z.string(),
    SLACK_CLIENT_SECRET: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string(),
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string(),
    NEXT_PUBLIC_SOCKET_URL: z.string(),
    NEXT_PUBLIC_SERVER_URL: z.string(),
    NEXT_PUBLIC_SLACK_CLIENT_ID: z.string(),
    NEXT_PUBLIC_SLACK_REDIRECT_URI: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
    CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    LISTMONK_USERNAME: process.env.LISTMONK_USERNAME,
    LISTMONK_PASSWORD: process.env.LISTMONK_PASSWORD,
    LISTMONK_URL: process.env.LISTMONK_URL,
    LISTMONK_LIST_ID: parseInt(process.env.LISTMONK_LIST_ID ?? "0"),
    ANTHROPIC_KEY: process.env.ANTHROPIC_KEY,
    OPENAI_KEY: process.env.OPENAI_KEY,
    GCLOUD_CREDS: process.env.GCLOUD_CREDS,
    RETELL_API_KEY: process.env.RETELL_API_KEY,
    VAPI_API_KEY: process.env.VAPI_API_KEY,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_SLACK_CLIENT_ID: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
    NEXT_PUBLIC_SLACK_REDIRECT_URI: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
    SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
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
