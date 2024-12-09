import { type SavedSearch } from "@repo/types/generated";
import { db } from "../db";
import { type PrismaClient } from "@prisma/client";

export class SearchService {
  constructor(private db: PrismaClient) {}

  async save(userId: string, search: SavedSearch) {
    return this.db.savedSearch.create({
      data: {
        ...search,
        ownerId: userId,
        filters: search.filters ?? {},
      },
    });
  }

  async update(userId: string, search: SavedSearch) {
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

  getById(userId: string, id: string) {
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

  async getAll(userId: string) {
    return this.db.savedSearch.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
