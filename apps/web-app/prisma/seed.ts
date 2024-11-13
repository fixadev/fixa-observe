import { PrismaClient } from "@prisma/client";
import {
  createOrUpdateVapiAssistant,
  deleteVapiAssistantById,
} from "../src/server/helpers/vapiHelpers";

const prisma = new PrismaClient();

async function main() {
  const testAgents = [
    {
      name: "lily",
      headshotUrl: "/images/agent-avatars/lily.jpeg",
      description: "a young woman who says like a lot",
      prompt:
        "You are lily smith, a young woman who says like a lot. end the call only when it is clear the conversation is over -- i.e. 'have a great day, bye or goodbye' or other indicators of the conversation being over.",
      voiceId: "sarah",
    },
    {
      name: "steve",
      headshotUrl: "/images/agent-avatars/steve.jpeg",
      description: "a normal guy",
      prompt: "You are steve wozniak, a normal guy.",
      voiceId: "ryan",
    },
    {
      name: "marge",
      headshotUrl: "/images/agent-avatars/marge.jpeg",
      description: "friendly elderly lady who loves to talk",
      prompt:
        "you are marge simpson, a friendly elderly lady who loves to talk",
      voiceId: "matilda",
    },
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
  const oldAssistants = await prisma.testAgent.findMany({
    where: { ownerId: "SYSTEM" },
  });
  const assistantIdsToDelete = oldAssistants.filter(
    (assistant) => !testAgents.some((agent) => agent.name === assistant.name),
  );

  for (const assistant of assistantIdsToDelete) {
    await deleteVapiAssistantById(assistant.id);
    await prisma.testAgent.delete({ where: { id: assistant.id } });
  }

  for (const agent of testAgents) {
    // await deleteVapiAssistantById(agent.id);
    const vapiAssistant = await createOrUpdateVapiAssistant(
      agent.prompt,
      agent.name,
      agent.voiceId,
      true,
    );
    await prisma.testAgent.upsert({
      where: { id: vapiAssistant.id },
      update: {
        name: agent.name,
        headshotUrl: agent.headshotUrl,
        description: agent.description,
        prompt: agent.prompt,
        ownerId: "SYSTEM",
      },
      create: {
        id: vapiAssistant.id,
        name: agent.name,
        headshotUrl: agent.headshotUrl,
        description: agent.description,
        prompt: agent.prompt,
        ownerId: "SYSTEM",
      },
    });
  }
}

void main();
