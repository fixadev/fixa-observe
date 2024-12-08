import { type PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { type EvalSchema } from "~/lib/eval";
import { type EvalSetWithIncludes } from "~/lib/types";
import { getCreatedUpdatedDeleted } from "~/lib/utils";

export class EvalService {
  constructor(private db: PrismaClient) {}

  async getGeneralEvals(userId: string) {
    return await this.db.eval.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createGeneralEval(userId: string, evaluation: EvalSchema) {
    return await this.db.eval.create({
      data: {
        ...evaluation,
        id: uuidv4(),
        ownerId: userId,
      },
    });
  }

  async updateGeneralEval(evaluation: EvalSchema) {
    return await this.db.eval.update({
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
      return await this.db.agent.update({
        where: { id: agentId },
        data: {
          enabledGeneralEvals: {
            connect: { id },
          },
        },
      });
    } else {
      return await this.db.agent.update({
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
    return await this.db.eval.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async getSets(userId: string) {
    return await this.db.evalSet.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createSet(userId: string, set: EvalSetWithIncludes) {
    return await this.db.evalSet.create({
      data: {
        ...set,
        id: uuidv4(),
        ownerId: userId,
        evals: {
          create: set.evals,
        },
      },
    });
  }

  async updateSet(userId: string, set: EvalSetWithIncludes) {
    const priorEvals = await this.db.eval.findMany({
      where: { evalSetId: set.id },
    });
    const { created, updated, deleted } = getCreatedUpdatedDeleted(
      priorEvals,
      set.evals,
    );
    return await this.db.evalSet.update({
      where: { id: set.id, ownerId: userId },
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

  async deleteSet(userId: string, id: string) {
    return await this.db.evalSet.delete({ where: { id, ownerId: userId } });
  }
}
