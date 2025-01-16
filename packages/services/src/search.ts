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
    ownerId,
  }: {
    name: string;
    filter: Filter;
    ownerId: string;
  }): Promise<SavedSearchWithIncludes> {
    const { timeRange, customerCallId, ...filterData } = filter;

    const searchData = {
      ...filterData,
      id: crypto.randomUUID(),
      ownerId,
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
    ownerId,
  }: {
    search: SavedSearchWithIncludes;
    ownerId: string;
  }): Promise<SavedSearchWithIncludes> {
    const { evaluationGroups, alerts, ...searchData } = search;
    delete searchData.metadata?.test;
    const updatedSearch = await this.db.savedSearch.update({
      where: {
        id: search.id,
        ownerId,
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

  async delete({
    ownerId,
    id,
  }: {
    ownerId: string;
    id: string;
  }): Promise<void> {
    await this.db.savedSearch.delete({
      where: {
        id,
        ownerId,
      },
    });
  }

  async getById({
    id,
    ownerId,
  }: {
    id: string;
    ownerId: string;
  }): Promise<SavedSearchWithIncludes | null> {
    const savedSearch = await this.db.savedSearch.findUnique({
      where: {
        id,
        ownerId,
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
    ownerId,
    includeDefault = true,
  }: {
    ownerId: string;
    includeDefault?: boolean;
  }): Promise<SavedSearchWithIncludes[]> {
    const where: Prisma.SavedSearchWhereInput = {
      ownerId,
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
    ownerId,
  }: {
    ownerId: string;
  }): Promise<SavedSearchWithIncludes | null> {
    const savedSearch = await this.db.savedSearch.findFirst({
      where: { ownerId, isDefault: true },
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
}
