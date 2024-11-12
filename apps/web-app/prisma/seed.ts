import { PrismaClient } from "@prisma/client";
import { createVapiAssistant } from "../src/server/helpers/vapiHelpers";

const prisma = new PrismaClient();

async function main() {
  const testAgents = [
    {
      name: "lily",
      headshotUrl: "/images/agent-avatars/lily.jpeg",
      description: "A busy professional who needs quick and accurate responses",
      prompt: "You are lily smith, a young woman who says like a lot",
      voiceId: "sarah",
    },
    {
      name: "steve",
      headshotUrl: "/images/agent-avatars/steve.jpeg",
      description: "A technical user who asks detailed questions",
      prompt: "You are steve wozniak, a normal guy",
      voiceId: "ryan",
    },
    // {
    //   id: "f6e5d4c3-b2a1-4f5e-9d8c-7b6a5c4d3e2f",
    //   name: "Sarah Johnson",
    //   headshotUrl: "/images/agent-avatars/steve.jpeg",
    //   description: "A non-technical user who needs clear explanations",
    //   prompt:
    //     "You are Sarah Johnson, a 45-year-old small business owner who isn't very tech-savvy. You prefer simple, clear explanations without technical jargon. You can get frustrated if things aren't explained in plain language.",
    // },
    // {
    //   id: "b9a8c7d6-e5f4-4a3b-8c2d-1e0f9a8b7c6d",
    //   name: "David Williams",
    //   headshotUrl: "/images/agent-avatars/steve.jpeg",
    //   description: "An elderly user who may need extra patience",
    //   prompt:
    //     "You are David Williams, a 72-year-old retiree who is not comfortable with technology. You sometimes need things repeated and explained very slowly. You appreciate when people are patient with you.",
    // },
    // {
    //   id: "c5d4e3f2-a1b0-4c5d-9e8f-7a6b5c4d3e2f",
    //   name: "Maria Garcia",
    //   headshotUrl: "/images/agent-avatars/steve.jpeg",
    //   description: "A user who prefers speaking in short, direct sentences",
    //   prompt:
    //     "You are Maria Garcia, a 31-year-old nurse who works long shifts. You're usually multitasking while on calls. You prefer brief, to-the-point conversations and clear action items.",
    // },
  ];

  // TODO: Add editing and deleting that works

  for (const agent of testAgents) {
    // await deleteVapiAssistantById(agent.id);
    const vapiAssistant = await createVapiAssistant(
      agent.prompt,
      agent.name,
      agent.voiceId,
      true,
    );
    await prisma.testAgent.create({
      data: {
        id: vapiAssistant.id,
        name: agent.name,
        headshotUrl: agent.headshotUrl,
        description: agent.description,
        prompt: agent.prompt,
      },
    });
  }
}

void main();
