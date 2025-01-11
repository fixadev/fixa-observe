import OpenAI from "openai";
import { env } from "../env";

const openaiProxy = new OpenAI({
  baseURL: "https://api.keywordsai.co/api/",
  apiKey: env.KEYWORDSAI_API_KEY,
});

const openaiClient = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const openai = env.USE_KEYWORDS ? openaiProxy : openaiClient;
