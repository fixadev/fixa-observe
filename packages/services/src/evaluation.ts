import {
  EvalContentType,
  EvalResultType,
  EvalType,
  type PrismaClient,
} from "@repo/db/src/index";
import { v4 as uuidv4 } from "uuid";
import {
  type Evaluation,
  type Agent,
  type EvaluationGroupWithIncludes,
  EvaluationTemplate,
} from "@repo/types/src/index";
import { getCreatedUpdatedDeleted } from "./utils";

export class EvaluationService {
  constructor(private db: PrismaClient) {}

  async getGeneralEvals({ userId }: { userId: string }): Promise<Evaluation[]> {
    return await this.db.evaluation.findMany({
      where: {
        evaluationTemplate: { ownerId: userId, type: EvalType.general },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getTemplates({
    userId,
  }: {
    userId: string;
  }): Promise<EvaluationTemplate[]> {
    return await this.db.evaluationTemplate.findMany({
      where: { ownerId: userId, deleted: false },
      orderBy: { createdAt: "asc" },
    });
  }

  async createTemplate({
    template,
    userId,
  }: {
    template: EvaluationTemplate;
    userId: string;
  }): Promise<EvaluationTemplate> {
    return await this.db.evaluationTemplate.create({
      data: { ...template, id: uuidv4(), ownerId: userId },
    });
  }

  async updateTemplate({
    template,
    userId,
  }: {
    template: EvaluationTemplate;
    userId: string;
  }): Promise<EvaluationTemplate> {
    return await this.db.evaluationTemplate.update({
      where: { id: template.id, ownerId: userId },
      data: { ...template },
    });
  }

  async create({
    evaluation,
    userId,
  }: {
    evaluation: Evaluation;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.create({
      data: {
        ...evaluation,
        scenarioId: null,
        params: evaluation.params ?? undefined,
      },
    });
  }

  async update({
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

  async toggleEnabled({
    id,
    enabled,
    userId,
  }: {
    id: string;
    agentId: string;
    enabled: boolean;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.update({
      where: { id, evaluationTemplate: { ownerId: userId } },
      data: {
        enabled,
      },
    });
  }

  async delete({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<Evaluation> {
    return await this.db.evaluation.delete({
      where: { id, evaluationTemplate: { ownerId: userId } },
    });
  }

  async getGroups({
    userId,
  }: {
    userId: string;
  }): Promise<EvaluationGroupWithIncludes[]> {
    return await this.db.evaluationGroup.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
      include: {
        evaluations: {
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });
  }

  async createGroup({
    group,
    userId,
  }: {
    group: EvaluationGroupWithIncludes;
    userId: string;
  }): Promise<EvaluationGroupWithIncludes> {
    return await this.db.evaluationGroup.create({
      data: {
        ...group,
        id: uuidv4(),
        ownerId: userId,
        evaluations: {
          create: group.evaluations.map((evaluation) => ({
            ...evaluation,
            id: uuidv4(),
            params: evaluation.params ?? undefined,
          })),
        },
      },
      include: {
        evaluations: {
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });
  }

  async updateGroup({
    group,
    userId,
  }: {
    group: EvaluationGroupWithIncludes;
    userId: string;
  }): Promise<EvaluationGroupWithIncludes> {
    const priorEvaluations = await this.db.evaluation.findMany({
      where: { evaluationGroupId: group.id },
    });
    const { created, updated, deleted } = await getCreatedUpdatedDeleted(
      priorEvaluations,
      group.evaluations,
    );
    return await this.db.evaluationGroup.update({
      where: { id: group.id, ownerId: userId },
      data: {
        ...group,
        evaluations: {
          updateMany: [
            ...deleted.map((evaluation) => ({
              where: { id: evaluation.id },
              data: { deleted: true },
            })),
            ...updated.map((evaluation) => ({
              where: { id: evaluation.id },
              data: {
                ...evaluation,
                params: evaluation.params ?? undefined,
              },
            })),
          ],
          createMany: {
            data: created.map((evaluation) => ({
              ...evaluation,
              id: uuidv4(),
              evaluationGroupId: group.id,
              params: evaluation.params ?? undefined,
            })),
          },
        },
      },
      include: {
        evaluations: {
          include: {
            evaluationTemplate: true,
          },
        },
      },
    });
  }

  async deleteGroup({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db.evaluationGroup.delete({ where: { id, ownerId: userId } });
  }
}
