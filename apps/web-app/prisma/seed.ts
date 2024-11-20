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
      prompt: "You are lily smith, a young woman who says like a lot. ", // end the call only when it is clear the conversation is over -- i.e. 'have a great day, bye or goodbye' or other indicators of the conversation being over.
      voiceId: "cgSgspJ2msm6clMCkdW9",
      enabled: true,
    },
    {
      name: "steve",
      headshotUrl: "/images/agent-avatars/steve.jpeg",
      description: "an irritable man who had a bad day",
      prompt:
        "You are steve wozniak, an irritable man who had a bad day. You are not very patient and get frustrated easily.",
      voiceId: "steve",
      // voiceId: "R99XgMGAPM4Bdpv1FJs2", // better voice id
      enabled: true,
    },
    {
      name: "marge",
      headshotUrl: "/images/agent-avatars/marge.jpeg",
      description: "elderly lady who sometimes gets carried away",
      prompt:
        "you are marge simpson, a friendly elderly lady who loves to talk and sometimes gets carried away.",
      voiceId: "matilda",
      // voiceId: "6zi9hbRGFbPJXunIKqJ4", // better voice id
      enabled: true,
    },
    {
      name: "daryl",
      headshotUrl: "/images/agent-avatars/daryl.jpeg",
      description: "An elderly man who may need extra patience",
      prompt:
        "You are daryl williams, a 72-year-old retiree who is not comfortable with technology. You sometimes need things repeated and explained very slowly. You appreciate when people are patient with you.",
      voiceId: "joseph",
      // voiceId: "7NERWC0HfmjQak4YqWff", // better voice id
      enabled: true,
    },
    // {
    //   name: "maria",
    //   headshotUrl: "/images/agent-avatars/maria.jpeg",
    //   description: "A woman who prefers speaking in short, direct sentences",
    //   prompt:
    //     "You are Maria Garcia, a 31-year-old nurse who works long shifts. you speak in short, direct sentences.",
    //   voiceId: "5S3VJEI4yXXfOSBrTB3q",
    //   enabled: false,
    // },
    // {
    //   name: "jose",
    //   headshotUrl: "/images/agent-avatars/jose.jpeg",
    //   description: "a native spanish speaker",
    //   prompt: "You are jose, a native spanish speaker.",
    //   voiceId: "3l9iCMrNSRR0w51JvFB0",
    //   enabled: false,
    // },
    // {
    //   name: "raj",
    //   headshotUrl: "/images/agent-avatars/raj.jpeg",
    //   description: "man with an indian accent",
    //   prompt: "You are raj, a man with an indian accent.",
    //   voiceId: "mCQMfsqGDT6IDkEKR20a",
    //   enabled: false,
    // },
    // {
    //   name: "klaus",
    //   headshotUrl: "/images/agent-avatars/klaus.jpeg",
    //   description: "man with a german accent",
    //   prompt: "You are klaus, a man with a german accent.",
    //   voiceId: "IokmXfIsrOE3umjiwHWz",
    //   enabled: false,
    // },
    // {
    //   name: "deng",
    //   headshotUrl: "/images/agent-avatars/deng.jpeg",
    //   description: "man with a chinese accent",
    //   prompt: "You are deng, a man with a chinese accent.",
    //   voiceId: "gAMZphRyrWJnLMDnom6H",
    //   enabled: false,
    // },
    // {
    //   name: "talia",
    //   headshotUrl: "/images/agent-avatars/talia.jpeg",
    //   description: "woman with a russian accent",
    //   prompt: "You are talia, a woman with a russian accent.",
    //   voiceId: "GCPLhb1XrVwcoKUJYcvz",
    //   enabled: false,
    // },
  ];

  // hello
  // // TODO: Add editing and deleting that works
  // const oldAssistants = await prisma.testAgent.findMany({
  //   where: { ownerId: "SYSTEM" },
  // });
  // const assistantIdsToDelete = oldAssistants.filter(
  //   (assistant) => !testAgents.some((agent) => agent.name === assistant.name),
  // );

  // for (const assistant of assistantIdsToDelete) {
  //   await deleteVapiAssistantById(assistant.id);
  //   await prisma.testAgent.delete({ where: { id: assistant.id } });
  // }

  for (let i = 0; i < testAgents.length; i++) {
    const agent = testAgents[i]!;
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
        enabled: agent.enabled,
        order: i,
        ownerId: "SYSTEM",
      },
      create: {
        id: vapiAssistant.id,
        name: agent.name,
        headshotUrl: agent.headshotUrl,
        description: agent.description,
        prompt: agent.prompt,
        enabled: agent.enabled,
        order: i,
        ownerId: "SYSTEM",
      },
    });
  }
}

void main();
