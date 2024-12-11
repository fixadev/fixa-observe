import { type PrismaClient } from "@repo/db/src/index";
import { type Alert } from "@repo/types/src/index";

export class AlertService {
  constructor(private db: PrismaClient) {}
  async get(userId: string): Promise<Alert[]> {
    return await this.db.alert.findMany({ where: { ownerId: userId } });
  }
  async getBySavedSearch(
    userId: string,
    savedSearchId: string,
  ): Promise<Alert[]> {
    return await this.db.alert.findMany({
      where: { ownerId: userId, savedSearchId },
    });
  }

  async save(userId: string, alert: Alert): Promise<Alert> {
    return await this.db.alert.create({
      data: {
        ...alert,
        ownerId: userId,
        details: alert.details ?? {},
      },
    });
  }
  async update(userId: string, alert: Alert): Promise<Alert> {
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
  async delete(userId: string, id: string): Promise<void> {
    await this.db.alert.delete({ where: { id, ownerId: userId } });
  }
}
