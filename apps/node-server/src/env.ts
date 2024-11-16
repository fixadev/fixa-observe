import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

// console.log(
//   "Raw env file contents:",
//   require("fs").readFileSync(".env", "utf8"),
// );

const envSchema = z.object({
  OPENAI_API_KEY: z.string(),
  VAPI_API_KEY: z.string(),
  HOST: z.string().min(1),
  PORT: z.string().transform((val) => parseInt(val)),
  ENVIRONMENT: z.enum(["development", "production", "test"]),
  DEBUG: z.string().transform((val) => val === "true"),
  AWS_BUCKET_NAME: z.string().min(1),
  AWS_BUCKET_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
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
    console.error("❌ Invalid environment variables:");

    // Get all required env vars
    const requiredVars = Object.keys(envSchema.shape);

    // Check which ones are missing or invalid
    requiredVars.forEach((varName) => {
      if (!(varName in process.env)) {
        console.error(`Missing ${varName}`);
      } else if (
        result.error.formErrors.fieldErrors[
          varName as keyof typeof envSchema.shape
        ]
      ) {
        console.error(
          `Invalid ${varName}: ${result.error.formErrors.fieldErrors[varName as keyof typeof envSchema.shape]}`,
        );
      }
    });

    throw new Error("Invalid environment variables");
  }

  return result.data;
};

export const env = validateEnv();
