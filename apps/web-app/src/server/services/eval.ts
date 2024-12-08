import { type PrismaClient } from "@prisma/client";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { type EvalSchema } from "~/lib/eval";
import { type EvalGroupWithIncludes } from "~/lib/types";
import { getCreatedUpdatedDeleted } from "~/lib/utils";

export class EvalService {
  constructor(private db: PrismaClient) {}

  async getGeneralEvals(userId: string) {
    return await db.eval.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createGeneralEval(userId: string, evaluation: EvalSchema) {
    return await db.eval.create({
      data: {
        ...evaluation,
        id: uuidv4(),
        ownerId: userId,
      },
    });
  }

  async updateGeneralEval(evaluation: EvalSchema) {
    return await db.eval.update({
      where: { id: evaluation.id },
      data: evaluation,
    });
  }

  async toggleGeneralEval({
    id,
    agentId,
    enabled,
  }: {
    id: string;
    agentId: string;
    enabled: boolean;
  }) {
    if (enabled) {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledGeneralEvals: {
            connect: { id },
          },
        },
      });
    } else {
      return await db.agent.update({
        where: { id: agentId },
        data: {
          enabledGeneralEvals: {
            disconnect: { id },
          },
        },
      });
    }
  }

  async deleteGeneralEval(id: string) {
    return await db.eval.update({ where: { id }, data: { deleted: true } });
  }

  async getEvalGroups(userId: string): Promise<EvalGroupWithIncludes[]> {
    return await db.evalGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evals: true,
        conditions: true,
      },
    });
  }

  async saveEvalGroupsState(
    evalGroups: EvalGroupWithIncludes[],
    userId: string,
  ) {
    const priorEvalGroups = await db.evalGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evals: true,
        conditions: true,
      },
    });
    const {
      created: evalGroupsToCreate,
      updated: evalGroupsToUpdate,
      deleted: evalGroupsToDelete,
    } = getCreatedUpdatedDeleted(priorEvalGroups, evalGroups);
    const deletePromises = evalGroupsToDelete.map((evalGroup) =>
      db.evalGroup.delete({ where: { id: evalGroup.id } }),
    );
    const updatePromises = evalGroupsToUpdate.map((evalGroup) => {
      const priorEvals = priorEvalGroups.find(
        (priorEvalGroup) => priorEvalGroup.id === evalGroup.id,
      );
      if (!priorEvals) {
        throw new Error("Prior evals not found");
      }

      const {
        created: evaluationsToCreate,
        updated: evaluationsToUpdate,
        deleted: evaluationsToDelete,
      } = getCreatedUpdatedDeleted(priorEvals.evals, evalGroup.evals);
      const {
        created: conditionsToCreate,
        updated: conditionsToUpdate,
        deleted: conditionsToDelete,
      } = getCreatedUpdatedDeleted(priorEvals.conditions, evalGroup.conditions);

      return db.evalGroup.update({
        where: { id: evalGroup.id },
        data: {
          ...evalGroup,
          evals: {
            deleteMany: {
              id: {
                in: evaluationsToDelete.map((evaluation) => evaluation.id),
              },
            },
            updateMany: {
              data: evaluationsToUpdate.map((evaluation) => ({
                ...evaluation,
                id: evaluation.id,
                evalGroupId: undefined,
              })),
              where: {
                id: {
                  in: evaluationsToUpdate.map((evaluation) => evaluation.id),
                },
              },
            },
            createMany: {
              data: evaluationsToCreate.map((evaluation) => ({
                ...evaluation,
                id: undefined,
                ownerId: userId,
                evalGroupId: undefined,
              })),
            },
          },
          conditions: {
            deleteMany: {
              id: {
                in: conditionsToDelete.map((condition) => condition.id),
              },
            },
            updateMany: {
              data: conditionsToUpdate.map((condition) => ({
                ...condition,
                evalGroupId: undefined,
              })),
              where: {
                id: {
                  in: conditionsToUpdate.map((condition) => condition.id),
                },
              },
            },
            createMany: {
              data: conditionsToCreate.map((condition) => ({
                ...condition,
                id: undefined,
                evalGroupId: undefined,
              })),
            },
          },
        },
      });
    });

    const createPromises = evalGroupsToCreate.map((evalGroup) =>
      db.evalGroup.create({
        data: {
          ...evalGroup,
          id: uuidv4(),
          ownerId: userId,
          evals: {
            createMany: {
              data: evalGroup.evals.map((evaluation) => ({
                ...evaluation,
                id: undefined,
                ownerId: userId,
                evalGroupId: undefined,
              })),
            },
          },
          conditions: {
            createMany: {
              data: evalGroup.conditions.map((condition) => ({
                ...condition,
                id: undefined,
                evalGroupId: undefined,
              })),
            },
          },
        },
      }),
    );
    await Promise.all([
      ...deletePromises,
      ...updatePromises,
      ...createPromises,
    ]);

    return await db.evalGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }
}
