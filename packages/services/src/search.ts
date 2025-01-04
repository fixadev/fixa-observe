import {
  AlertWithDetails,
  AlertWithDetailsSchema,
  Filter,
  SavedSearchWithIncludes,
  SavedSearchWithIncludesSchema,
} from "@repo/types/src/index";
import { Prisma, type PrismaClient } from "@repo/db/src/index";

export class SearchService {
  constructor(private db: PrismaClient) {}

  async save({
    name,
    filter,
    userId,
  }: {
    name: string;
    filter: Filter;
    userId: string;
  }): Promise<SavedSearchWithIncludes> {
    const {
      evaluationGroups: evalSets,
      alerts,
      timeRange,
      customerCallId,
      ...filterData
    } = filter;

    const searchData = {
      ...filterData,
      id: crypto.randomUUID(),
      ownerId: userId,
      createdAt: new Date(),
      name,
      agentId: filter.agentId ?? [],
      lookbackPeriod: filter.lookbackPeriod ?? {},
      metadata: filter.metadata ?? {},
    };
    delete searchData.metadata.test;

    const savedSearch = await this.db.savedSearch.create({
      data: searchData,
      include: {
        evaluationGroups: {
          include: {
            evaluations: {
              include: { evaluationTemplate: true },
            },
          },
        },
        alerts: true,
      },
    });
    const parsed = SavedSearchWithIncludesSchema.safeParse(savedSearch);
    if (!parsed.success) {
      throw new Error("Failed to save: " + parsed.error.message);
    }
    return parsed.data;
  }

  async update({
    search,
    userId,
  }: {
    search: SavedSearchWithIncludes;
    userId: string;
  }): Promise<SavedSearchWithIncludes> {
    const { evaluationGroups: evalSets, alerts, ...searchData } = search;
    delete searchData.metadata?.test;
    const updatedSearch = await this.db.savedSearch.update({
      where: {
        id: search.id,
        ownerId: userId,
      },
      data: {
        ...searchData,
        lookbackPeriod: searchData.lookbackPeriod ?? {},
        timeRange: searchData.timeRange ?? undefined,
        metadata: searchData.metadata ?? {},
      },
      include: {
        evaluationGroups: {
          include: {
            evaluations: {
              include: { evaluationTemplate: true },
            },
          },
        },
        alerts: true,
      },
    });
    const parsed = SavedSearchWithIncludesSchema.safeParse(updatedSearch);
    if (!parsed.success) {
      throw new Error("Failed to save: " + parsed.error.message);
    }
    return parsed.data;
  }

  async delete({ userId, id }: { userId: string; id: string }): Promise<void> {
    await this.db.savedSearch.delete({
      where: {
        id,
        ownerId: userId,
      },
    });
  }

  async getById({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<SavedSearchWithIncludes | null> {
    const savedSearch = await this.db.savedSearch.findUnique({
      where: {
        id,
        ownerId: userId,
      },
      include: {
        alerts: true,
        evaluationGroups: {
          include: {
            evaluations: {
              include: { evaluationTemplate: true },
            },
          },
        },
      },
    });
    const parsed = SavedSearchWithIncludesSchema.safeParse(savedSearch);
    return parsed.success ? parsed.data : null;
  }

  async getAll({
    userId,
    includeDefault = true,
  }: {
    userId: string;
    includeDefault?: boolean;
  }): Promise<SavedSearchWithIncludes[]> {
    const where: Prisma.SavedSearchWhereInput = {
      ownerId: userId,
    };
    if (!includeDefault) {
      where.isDefault = false;
    }
    const savedSearches = await this.db.savedSearch.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
      include: {
        alerts: { where: { enabled: true } },
        evaluationGroups: {
          include: {
            evaluations: {
              include: { evaluationTemplate: true },
            },
          },
        },
      },
    });

    const parsedSearches: SavedSearchWithIncludes[] = [];

    for (const search of savedSearches) {
      const parsed = SavedSearchWithIncludesSchema.safeParse(search);
      if (!parsed.success) {
        console.log("parsed error", JSON.stringify(parsed.error, null, 2));
      } else {
        parsedSearches.push(parsed.data);
      }
    }
    return parsedSearches;
  }

  async getDefault({
    userId,
  }: {
    userId: string;
  }): Promise<SavedSearchWithIncludes | null> {
    const savedSearch = await this.db.savedSearch.findFirst({
      where: { ownerId: userId, isDefault: true },
      include: {
        alerts: true,
        evaluationGroups: {
          include: {
            evaluations: {
              include: { evaluationTemplate: true },
            },
          },
        },
      },
    });
    const parsed = SavedSearchWithIncludesSchema.safeParse(savedSearch);
    return parsed.success ? parsed.data : null;
  }

  async createAlert({
    alert,
    userId,
  }: {
    alert: AlertWithDetails;
    userId: string;
  }): Promise<AlertWithDetails> {
    const alertWithDetails = await this.db.alert.create({
      data: {
        ...alert,
        id: crypto.randomUUID(),
        ownerId: userId,
        details: alert.details ?? {},
      },
    });
    return AlertWithDetailsSchema.parse(alertWithDetails);
  }

  async updateAlert({
    alert,
    userId,
  }: {
    alert: AlertWithDetails;
    userId: string;
  }): Promise<AlertWithDetails> {
    const alertWithDetails = await this.db.alert.update({
      where: {
        id: alert.id,
        ownerId: userId,
      },
      data: {
        ...alert,
        details: alert.details ?? {},
      },
    });
    return AlertWithDetailsSchema.parse(alertWithDetails);
  }

  async deleteAlert({
    id,
    userId,
  }: {
    id: string;
    userId: string;
  }): Promise<void> {
    await this.db.alert.delete({
      where: {
        id,
        ownerId: userId,
      },
    });
  }
}
