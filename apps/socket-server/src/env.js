import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";
import dotenv from 'dotenv';

dotenv.config();

export const env = createEnv({
  /*
   * Server-side environment variables schema
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.string().default("8080"),
    OPENAI_KEY: z.string(),
    VAPI_KEY: z.string(),
  },

  /*
   * Environment variables loaded from .env
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    OPENAI_KEY: process.env.OPENAI_KEY,
    VAPI_KEY: process.env.VAPI_KEY,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

