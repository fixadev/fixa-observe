import { type PrismaClient } from "@prisma/client";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { type EvalSchema } from "~/lib/eval";
import { type EvalSetWithIncludes } from "~/lib/types";
import { getCreatedUpdatedDeleted } from "~/lib/utils";

export class EvalService {
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

  async getSets(userId: string) {
    return await db.evalSet.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createSet(set: EvalSetWithIncludes) {
    return await db.evalSet.create({
      data: {
        ...set,
        id: uuidv4(),
        evals: {
          create: set.evals,
        },
      },
    });
  }

  async updateSet(set: EvalSetWithIncludes) {
    const priorEvals = await db.eval.findMany({
      where: { evalSetId: set.id },
    });
    const { created, updated, deleted } = getCreatedUpdatedDeleted(
      priorEvals,
      set.evals,
    );
    return await db.evalSet.update({
      where: { id: set.id },
      data: {
        ...set,
        evals: {
          create: created,
          update: updated.map((evaluation) => ({
            where: { id: evaluation.id },
            data: evaluation,
          })),
          delete: deleted,
        },
      },
    });
  }

  async deleteSet(id: string) {
    return await db.evalSet.delete({ where: { id } });
  }
}
