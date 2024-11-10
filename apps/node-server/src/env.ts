import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  VAPI_API_KEY: z.string(),
  HOST: z.string().min(1),
  PORT: z.string().transform((val) => parseInt(val)),
  ENVIRONMENT: z.enum(["development", "production", "test"]),
  DEBUG: z.string().transform((val) => val === "true"),
  FAL_API_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_BUCKET_REGION: z.string().min(1),
  AWS_S3_ACCESS_KEY: z.string().min(1),
  AWS_S3_SECRET: z.string().min(1),
  DEEPGRAM_API_KEY: z.string().min(1),
  AUDIO_SERVICE_URL: z.string().min(1),
});

// Validate and transform environment variables
const validateEnv = () => {
  if (process.env.SKIP_ENV_VALIDATION) {
    return process.env;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    throw new Error("Invalid environment variables");
  }

  return result.data;
};

export const env = validateEnv();
