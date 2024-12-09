import { type SavedSearch } from "@repo/types/src/index";
import { type PrismaClient } from "@repo/db";

export class SearchService {
  constructor(private db: PrismaClient) {}

  async save(userId: string, search: SavedSearch): Promise<SavedSearch> {
    return this.db.savedSearch.create({
      data: {
        ...search,
        ownerId: userId,
        filters: search.filters ?? {},
      },
    });
  }

  async update(userId: string, search: SavedSearch): Promise<SavedSearch> {
    return this.db.savedSearch.update({
      where: {
        id: search.id,
      },
      data: {
        ...search,
        ownerId: userId,
        filters: search.filters ?? {},
      },
    });
  }

  async getById(userId: string, id: string): Promise<SavedSearch | null> {
    return this.db.savedSearch.findUnique({
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
  }

  async getAll(userId: string): Promise<SavedSearch[]> {
    return this.db.savedSearch.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
