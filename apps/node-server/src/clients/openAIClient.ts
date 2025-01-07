import OpenAI from "openai";
import { env } from "../env";

export const openai = new OpenAI({
  baseURL: "https://api.keywordsai.co/api/",
  apiKey: env.KEYWORDSAI_API_KEY,
});
