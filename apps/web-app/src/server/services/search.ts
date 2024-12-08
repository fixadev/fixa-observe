import { type SavedSearch } from "prisma/generated/zod";
import { db } from "../db";

export class SearchService {
  async save(userId: string, search: SavedSearch) {
    return db.savedSearch.create({
      data: {
        ...search,
        ownerId: userId,
        filters: search.filters ?? {},
      },
    });
  }

  async update(userId: string, search: SavedSearch) {
    return db.savedSearch.update({
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

  getById(id: string) {
    return db.savedSearch.findUnique({
      where: {
        id,
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
    return db.savedSearch.findMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
