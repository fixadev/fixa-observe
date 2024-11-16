import { db } from "../db";
import { type ScenarioWithEvals, type CreateScenarioSchema } from "~/lib/agent";
import { v4 as uuidv4 } from "uuid";
import { type PrismaClient } from "@prisma/client";
// import { createVapiAssistant } from "../helpers/vapiHelpers";

export class AgentService {
  constructor(private db: PrismaClient) {}
  async createAgent(
    phoneNumber: string,
    name: string,
    systemPrompt: string,
    scenarios: CreateScenarioSchema[],
    ownerId: string,
  ) {
    const testAgents = await db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
      },
    });

    return await db.agent.create({
      data: {
        id: uuidv4(),
        phoneNumber,
        name,
        systemPrompt,
        scenarios: {
          createMany: {
            data: scenarios,
          },
        },
        enabledTestAgents: {
          connect: testAgents.map((testAgent) => ({
            id: testAgent.id,
          })),
        },
        ownerId,
      },
    });
  }

  async getAgent(id: string) {
    return await db.agent.findUnique({
      where: { id },
      include: {
        scenarios: {
          include: {
            evals: true,
          },
        },
        enabledTestAgents: true,
      },
    });
  }

  async getAllAgents(ownerId: string) {
    // return await db.agent.findMany({ where: {} });
    return await db.agent.findMany({ where: { ownerId } });
  }

  // async createTestAgent(
  //   name: string,
  //   prompt: string,
  //   ownerId: string,
  //   headshotUrl: string,
  //   description: string,
  // ) {
  //   const agent = await createVapiAssistant(prompt, name);

  //   return await db.testAgent.create({
  //     data: {
  //       id: agent.id,
  //       name,
  //       prompt,
  //       ownerId,
  //       headshotUrl,
  //       description,
  //     },
  //   });
  // }

  async getTestAgents(ownerId: string) {
    return await db.testAgent.findMany({
      where: {
        OR: [{ ownerId }, { ownerId: "SYSTEM" }],
      },
    });
  }

  async toggleTestAgentEnabled(
    agentId: string,
    testAgentId: string,
    enabled: boolean,
  ) {
    if (enabled) {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledTestAgents: {
            connect: { id: testAgentId },
          },
        },
      });
    } else {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledTestAgents: {
            disconnect: { id: testAgentId },
          },
        },
      });
    }
  }

  async updateAgentScenarios(
    id: string,
    scenarios: Array<ScenarioWithEvals | CreateScenarioSchema>,
  ) {
    const existingScenarios = scenarios.filter(
      (s): s is ScenarioWithEvals => "id" in s,
    );
    const newScenarios = scenarios.filter(
      (s): s is CreateScenarioSchema => !("id" in s),
    );

    const currentScenarios = await db.scenario.findMany({
      where: { agentId: id },
      select: { id: true },
    });

    const scenariosToDelete = currentScenarios
      .map((s) => s.id)
      .filter(
        (currentId) => !existingScenarios.find((s) => s.id === currentId),
      );

    return await db.agent.update({
      where: { id },
      data: {
        scenarios: {
          updateMany: existingScenarios.map((scenario) => ({
            where: { id: scenario.id },
            data: {
              name: scenario.name,
              instructions: scenario.instructions,
              successCriteria: scenario.successCriteria,
              evals: {
                deleteMany: {},
                createMany: {
                  data: scenario.evals,
                },
              },
            },
          })),
          createMany: {
            data: newScenarios.map((scenario) => ({
              name: scenario.name,
              instructions: scenario.instructions,
              successCriteria: scenario.successCriteria,
              evals: {
                createMany: {
                  data: scenario.evals,
                },
              },
            })),
          },
          deleteMany: {
            id: { in: scenariosToDelete },
          },
        },
      },
      include: {
        scenarios: {
          include: {
            evals: true,
          },
        },
      },
    });
  }

  async updateAgentSettings(input: {
    id: string;
    phoneNumber: string;
    name: string;
  }) {
    return await db.agent.update({
      where: { id: input.id },
      data: input,
    });
  }
}
