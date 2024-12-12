import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.keywordsai.co/api/",
  apiKey: "vMGDdjYI.iOluiIsiqjEbb1gPs0Ve9FiXzdc8y4JZ",
});

const main = async () => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Hello, world!" }],
  });

  console.log(response);
};

main();

// const another = async () => {
//   try {
//     console.log("Starting fetch");
//     const response = await fetch(
//       "https://api.keywordsai.co/api/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer vMGDdjYI.iOluiIsiqjEbb1gPs0Ve9FiXzdc8y4JZ",
//         },
//         body: JSON.stringify({
//           model: "gpt-4o", // Change the model id here
//           messages: [{ role: "user", content: "Say 'Hello World'" }],
//         }),
//       },
//     );

//     console.log(response);
//   } catch (error) {
//     console.error(error);
//   }
// };

// void main();
