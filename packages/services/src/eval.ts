import {
  EvalType,
  EvaluationTemplate,
  type PrismaClient,
} from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type Evaluation,
  type Agent,
  type EvalSetWithIncludes,
} from "@repo/types/src/index";
import { getCreatedUpdatedDeleted } from "./utils";

export class EvalService {
  constructor(private db: PrismaClient) {}

  async getGeneralEvals({ userId }: { userId: string }): Promise<Evaluation[]> {
    return await this.db.evaluation.findMany({
      where: {
        evaluationTemplate: { ownerId: userId, type: EvalType.general },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async createGeneralEval({
    evaluation,
    userId,
  }: {
    evaluation: Evaluation;
    userId: string;
  }): Promise<EvaluationTemplate> {
    return await this.db.evaluationTemplate.create({
      data: {
        ...evaluation,
        id: uuidv4(),
        ownerId: userId,
        type: EvalType.general,
      },
    });
  }

  async updateGeneralEval({
    evaluation,
    userId,
  }: {
    evaluation: Evaluation;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.update({
      where: { id: evaluation.id, evaluationTemplate: { ownerId: userId } },
      data: { ...evaluation, params: evaluation.params ?? undefined },
    });
  }

  async toggleGeneralEval({
    id,
    agentId,
    enabled,
    userId,
  }: {
    id: string;
    agentId: string;
    enabled: boolean;
    userId: string;
  }): Promise<Agent> {
    if (enabled) {
      return await this.db.evaluation.update({
        where: { id },
        data: {
          enabled,
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

  async deleteGeneralEval({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.update({
      where: { id, evaluationTemplate: { ownerId: userId } },
      data: { deleted: true },
    });
  }

  async getSets({
    userId,
  }: {
    userId: string;
  }): Promise<EvalSetWithIncludes[]> {
    return await this.db.evaluationGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evaluations: true,
      },
    });
  }

  async createSet({
    set,
    userId,
  }: {
    set: EvalSetWithIncludes;
    userId: string;
  }): Promise<EvalSetWithIncludes> {
    return await this.db.evaluationGroup.create({
      data: {
        ...set,
        id: uuidv4(),
        ownerId: userId,
        evaluations: {
          create: set.evals.map((evaluation) => ({
            ...evaluation,
            id: uuidv4(),
            evaluationTemplateId: undefined,
            evaluationGroupId: undefined,
            scenarioId: undefined,
          })),
        },
      },
      include: {
        evaluations: { orderBy: { createdAt: "asc" } },
      },
    });
  }

  async updateSet({
    set,
    userId,
  }: {
    set: EvalSetWithIncludes;
    userId: string;
  }): Promise<EvalSetWithIncludes> {
    const priorEvals = await this.db.eval.findMany({
      where: { evalSetId: set.id },
    });
    const { created, updated, deleted } = getCreatedUpdatedDeleted(
      priorEvals,
      set.evals,
    );
    return await this.db.evaluationGroup.update({
      where: { id: set.id, ownerId: userId },
      data: {
        ...set,
        evaluations: {
          create: created.map((evaluation) => ({
            ...evaluation,
            id: uuidv4(),
            evaluationGroupId: undefined,
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

  async deleteSet({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db.evalSet.delete({ where: { id, ownerId: userId } });
  }
}
