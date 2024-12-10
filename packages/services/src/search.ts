import {
  AlertWithDetails,
  AlertWithDetailsSchema,
  Filter,
  SavedSearchWithIncludes,
} from "@repo/types/src/index";
import { type PrismaClient } from "@repo/db";

export class SearchService {
  constructor(private db: PrismaClient) {}

  async save(
    userId: string,
    filter: Filter,
    name: string,
  ): Promise<SavedSearchWithIncludes> {
    const { evalSets, alerts, timeRange, customerCallId, ...filterData } =
      filter;

    const searchData = {
      ...filterData,
      id: crypto.randomUUID(),
      ownerId: userId,
      createdAt: new Date(),
      name,
      agentId: filter.agentId ?? "",
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

  async update(
    userId: string,
    search: SavedSearchWithIncludes,
  ): Promise<SavedSearchWithIncludes> {
    const { evalSets, alerts, ...searchData } = search;
    const updatedSearch = await this.db.savedSearch.update({
      where: {
        id: search.id,
        ownerId: userId,
      },
      data: {
        ...searchData,
        lookbackPeriod: searchData.lookbackPeriod ?? {},
        timeRange: searchData.timeRange ?? {},
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

  async getById(
    userId: string,
    id: string,
  ): Promise<SavedSearchWithIncludes | null> {
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
    return parsed.success ? parsed.data : null;
  }

  async getAll(userId: string): Promise<SavedSearchWithIncludes[]> {
    const savedSearches = await this.db.savedSearch.findMany({
      where: {
        ownerId: userId,
      },
    });

    const parsed = SavedSearchWithIncludes.array().safeParse(savedSearches);
    return parsed.success ? parsed.data : [];
  }

  async createAlert(
    userId: string,
    alert: AlertWithDetails,
  ): Promise<AlertWithDetails> {
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

  async updateAlert(
    userId: string,
    alert: AlertWithDetails,
  ): Promise<AlertWithDetails> {
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

  async deleteAlert(userId: string, id: string): Promise<void> {
    await this.db.alert.delete({
      where: {
        id,
        ownerId: userId,
      },
    });
  }
}
