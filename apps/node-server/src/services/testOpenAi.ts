import { openai } from "../utils/OpenAIClient";

const testOpenAI = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Say hello!",
        },
      ],
    });

    console.log("OpenAI Test Response:");
    console.log(response.choices[0]?.message?.content);
  } catch (error) {
    console.error("Error testing OpenAI:", error);
    throw error;
  }
};

// Run the test
testOpenAI().catch(console.error);
