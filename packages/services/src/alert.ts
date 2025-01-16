import { type PrismaClient } from "@repo/db/src/index";
import {
  AlertWithDetails,
  AlertWithDetailsSchema,
  type Alert,
} from "@repo/types/src/index";

export class AlertService {
  constructor(private db: PrismaClient) {}
  async get(userId: string): Promise<Alert[]> {
    return await this.db.alert.findMany({ where: { ownerId: userId } });
  }
  async getByOwnerId(ownerId: string): Promise<Alert[]> {
    return await this.db.alert.findMany({ where: { ownerId } });
  }
  async getBySavedSearch(
    userId: string,
    savedSearchId: string,
  ): Promise<Alert[]> {
    return await this.db.alert.findMany({
      where: { ownerId: userId, savedSearchId },
    });
  }

  async getById(userId: string, alertId: string): Promise<Alert | null> {
    return await this.db.alert.findFirst({
      where: { id: alertId, ownerId: userId },
    });
  }

  async create({
    alert,
    ownerId,
  }: {
    alert: AlertWithDetails;
    ownerId: string;
  }): Promise<AlertWithDetails> {
    const alertWithDetails = await this.db.alert.create({
      data: {
        ...alert,
        id: crypto.randomUUID(),
        ownerId,
        details: alert.details ?? {},
      },
    });
    return AlertWithDetailsSchema.parse(alertWithDetails);
  }

  async update({
    alert,
    ownerId,
  }: {
    alert: AlertWithDetails;
    ownerId: string;
  }): Promise<AlertWithDetails> {
    const alertWithDetails = await this.db.alert.update({
      where: {
        id: alert.id,
        ownerId,
      },
      data: {
        ...alert,
        details: alert.details ?? {},
      },
    });
    return AlertWithDetailsSchema.parse(alertWithDetails);
  }

  async delete({
    id,
    ownerId,
  }: {
    id: string;
    ownerId: string;
  }): Promise<void> {
    await this.db.alert.delete({
      where: {
        id,
        ownerId,
      },
    });
  }
}
