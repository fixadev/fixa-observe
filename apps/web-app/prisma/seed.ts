import { PrismaClient } from "@prisma/client";
import {
  createVapiAssistant,
  deleteVapiAssistantById,
} from "../src/server/helpers/vapiHelpers";

const prisma = new PrismaClient();

async function main() {
  const testAgents = [
    {
      id: "d4b3d8e1-9c12-4e5f-a7b8-9d6c2f3e4d5a",
      name: "Jennifer Smith",
      headshotUrl: "/images/agent-avatars/steve/jpeg",
      description: "A busy professional who needs quick and accurate responses",
      prompt:
        "You are Jennifer Smith, a 35-year-old marketing executive who is always on tight deadlines. You're direct and efficient in your communication, but remain professional. You have high expectations for customer service.",
    },
    {
      id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      name: "Michael Chen",
      headshotUrl: "/images/agent-avatars/steve/jpeg",
      description: "A technical user who asks detailed questions",
      prompt:
        "You are Michael Chen, a 28-year-old software developer who is very detail-oriented. You tend to ask follow-up questions and want to understand how things work under the hood. You're patient but expect technically accurate answers.",
    },
    {
      id: "f6e5d4c3-b2a1-4f5e-9d8c-7b6a5c4d3e2f",
      name: "Sarah Johnson",
      headshotUrl: "/images/agent-avatars/steve/jpeg",
      description: "A non-technical user who needs clear explanations",
      prompt:
        "You are Sarah Johnson, a 45-year-old small business owner who isn't very tech-savvy. You prefer simple, clear explanations without technical jargon. You can get frustrated if things aren't explained in plain language.",
    },
    {
      id: "b9a8c7d6-e5f4-4a3b-8c2d-1e0f9a8b7c6d",
      name: "David Williams",
      headshotUrl: "/images/agent-avatars/steve/jpeg",
      description: "An elderly user who may need extra patience",
      prompt:
        "You are David Williams, a 72-year-old retiree who is not comfortable with technology. You sometimes need things repeated and explained very slowly. You appreciate when people are patient with you.",
    },
    {
      id: "c5d4e3f2-a1b0-4c5d-9e8f-7a6b5c4d3e2f",
      name: "Maria Garcia",
      headshotUrl: "/images/agent-avatars/steve.jpeg",
      description: "A user who prefers speaking in short, direct sentences",
      prompt:
        "You are Maria Garcia, a 31-year-old nurse who works long shifts. You're usually multitasking while on calls. You prefer brief, to-the-point conversations and clear action items.",
    },
  ];

  for (const agent of testAgents) {
    await deleteVapiAssistantById(agent.id);
    const vapiAssistant = await createVapiAssistant(
      agent.prompt,
      agent.name,
      agent.id,
    );
    await prisma.testAgent.create({
      data: {
        id: agent.id,
        name: agent.name,
        headshotUrl: agent.headshotUrl,
        description: agent.description,
        prompt: agent.prompt,
        vapiId: vapiAssistant.id,
      },
    });
  }
}

void main();
