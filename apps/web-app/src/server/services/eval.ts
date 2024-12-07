import { type PrismaClient } from "@prisma/client";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { type EvalGroupWithEvals, type EvalSchema } from "~/lib/eval";

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

  async saveEvalGroupsState(evalGroups: EvalGroupWithEvals[], userId: string) {
    const priorEvalGroups = await db.evalGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evals: true,
      },
    });
    const evalGroupsToDelete = priorEvalGroups.filter(
      (priorEvalGroup) =>
        !evalGroups.some(
          (newEvalGroup) => newEvalGroup.id === priorEvalGroup.id,
        ),
    );
    const evalGroupsToUpdate = evalGroups.filter((evalGroup) =>
      priorEvalGroups.some(
        (priorEvalGroup) => priorEvalGroup.id === evalGroup.id,
      ),
    );
    const evalGroupsToCreate = evalGroups.filter(
      (evalGroup) =>
        !priorEvalGroups.some(
          (priorEvalGroup) => priorEvalGroup.id === evalGroup.id,
        ),
    );
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
      const evaluationsToDelete = priorEvals.evals.filter(
        (priorEvaluation) =>
          !evalGroup.evals.some(
            (newEvaluation) => newEvaluation.id === priorEvaluation.id,
          ),
      );
      const evaluationsToUpdate = evalGroup.evals.filter((evaluation) =>
        priorEvals.evals.some((priorEval) => priorEval.id === evaluation.id),
      );
      const evaluationsToCreate = evalGroup.evals.filter(
        (evaluation) =>
          !priorEvals.evals.some((priorEval) => priorEval.id === evaluation.id),
      );

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
                id: uuidv4(),
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
          evals: {
            createMany: {
              data: evalGroup.evals.map((evaluation) => ({
                ...evaluation,
                id: uuidv4(),
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
