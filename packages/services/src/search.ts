import {
  AlertWithDetails,
  AlertWithDetailsSchema,
  Filter,
  SavedSearchWithIncludes,
} from "@repo/types/src/index";
import { type PrismaClient } from "@repo/db/src/index";

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
    const { evalSets, alerts, timeRange, customerCallId, ...filterData } =
      filter;

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

    const savedSearch = await this.db.savedSearch.create({
      data: searchData,
      include: {
        evalSets: true,
        alerts: true,
      },
    });
    const parsed = SavedSearchWithIncludes.safeParse(savedSearch);
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
    const { evalSets, alerts, ...searchData } = search;
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
        evalSets: true,
        alerts: true,
      },
    });
    const parsed = SavedSearchWithIncludes.safeParse(updatedSearch);
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
        evalSets: {
          include: {
            evals: true,
          },
        },
      },
    });
    const parsed = SavedSearchWithIncludes.safeParse(savedSearch);
    console.log("parsed", JSON.stringify(parsed, null, 2));
    return parsed.success ? parsed.data : null;
  }

  async getAll({
    userId,
  }: {
    userId: string;
  }): Promise<SavedSearchWithIncludes[]> {
    const savedSearches = await this.db.savedSearch.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const parsedSearches: SavedSearchWithIncludes[] = [];
    for (const search of savedSearches) {
      const parsed = SavedSearchWithIncludes.safeParse(search);
      if (!parsed.success) {
        console.log("parsed error", parsed.error);
      } else {
        parsedSearches.push(parsed.data);
      }
    }
    return parsedSearches;
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
