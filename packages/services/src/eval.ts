import { type PrismaClient } from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type Eval,
  type Agent,
  type EvalSetWithIncludes,
} from "@repo/types/src/index";
import { getCreatedUpdatedDeleted } from "./utils";

export class EvalService {
  constructor(private db: PrismaClient) {}

  async getGeneralEvals(userId: string): Promise<Eval[]> {
    return await this.db.eval.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async createGeneralEval(userId: string, evaluation: Eval): Promise<Eval> {
    return await this.db.eval.create({
      data: {
        ...evaluation,
        id: uuidv4(),
        ownerId: userId,
      },
    });
  }

  async updateGeneralEval(evaluation: Eval): Promise<Eval> {
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
  }): Promise<Agent> {
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

  async deleteGeneralEval(id: string): Promise<Eval> {
    return await this.db.eval.update({
      where: { id },
      data: { deleted: true },
    });
  }

  async getSets(userId: string): Promise<EvalSetWithIncludes[]> {
    return await this.db.evalSet.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evals: true,
      },
    });
  }

  async createSet(
    userId: string,
    set: EvalSetWithIncludes,
  ): Promise<EvalSetWithIncludes> {
    return await this.db.evalSet.create({
      data: {
        ...set,
        id: uuidv4(),
        ownerId: userId,
        evals: {
          create: set.evals.map((evaluation) => ({
            ...evaluation,
            id: uuidv4(),
            evalSetId: undefined,
            scenarioId: undefined,
          })),
        },
      },
      include: {
        evals: true,
      },
    });
  }

  async updateSet(
    userId: string,
    set: EvalSetWithIncludes,
  ): Promise<EvalSetWithIncludes> {
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
          create: created.map((evaluation) => ({
            ...evaluation,
            id: uuidv4(),
            evalSetId: undefined,
            scenarioId: undefined,
            agentId: undefined,
          })),
          update: updated.map((evaluation) => ({
            where: { id: evaluation.id },
            data: {
              ...evaluation,
              scenarioId: undefined,
              agentId: undefined,
              evalSetId: undefined,
            },
          })),
          delete: deleted,
        },
      },
      include: {
        evals: true,
      },
    });
  }

  async deleteSet(userId: string, id: string): Promise<void> {
    await this.db.evalSet.delete({ where: { id, ownerId: userId } });
  }
}
