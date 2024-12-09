import { type PrismaClient } from "@prisma/client";
import { type Alert } from "@repo/types/generated";

export class AlertService {
  constructor(private db: PrismaClient) {}
  async get(userId: string) {
    return await this.db.alert.findMany({ where: { ownerId: userId } });
  }
  async getBySavedSearch(userId: string, savedSearchId: string) {
    return await this.db.alert.findMany({
      where: { ownerId: userId, savedSearchId },
    });
  }

  async save(userId: string, alert: Alert) {
    return await this.db.alert.create({
      data: {
        ...alert,
        ownerId: userId,
        details: alert.details ?? {},
      },
    });
  }
  async update(userId: string, alert: Alert) {
    return await this.db.alert.update({
      where: {
        id: alert.id,
        ownerId: userId,
      },
      data: {
        ...alert,
        details: alert.details ?? {},
      },
    });
  }
  async delete(userId: string, id: string) {
    return await this.db.alert.delete({ where: { id, ownerId: userId } });
  }
}
