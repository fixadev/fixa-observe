import OpenAI from "openai";
import { env } from "../env";

const openai = new OpenAI({
  apiKey: env.OPENAI_KEY,
});

export default openai;
