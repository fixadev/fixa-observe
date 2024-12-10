import {
  AlertWithDetails,
  AlertWithDetailsSchema,
  SavedSearchWithIncludes,
  type SavedSearch,
} from "@repo/types/src/index";
import { type PrismaClient } from "@repo/db";

export class SearchService {
  constructor(private db: PrismaClient) {}

  async save(userId: string, search: SavedSearch): Promise<SavedSearch> {
    return this.db.savedSearch.create({
      data: {
        ...search,
        ownerId: userId,
        lookbackPeriod: search.lookbackPeriod ?? {},
        timeRange: search.timeRange ?? {},
        metadata: search.metadata ?? {},
      },
    });
  }

  async update(userId: string, search: SavedSearch): Promise<SavedSearch> {
    return this.db.savedSearch.update({
      where: {
        id: search.id,
        ownerId: userId,
      },
      data: {
        ...search,
        lookbackPeriod: search.lookbackPeriod ?? {},
        timeRange: search.timeRange ?? {},
        metadata: search.metadata ?? {},
      },
    });
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
