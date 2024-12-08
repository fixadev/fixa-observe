import { type Alert } from "prisma/generated/zod";
import { db } from "~/server/db";

export class AlertService {
  async get(userId: string) {
    return await db.alert.findMany({ where: { ownerId: userId } });
  }
  async save(userId: string, alert: Alert) {
    return await db.alert.create({
      data: {
        ...alert,
        ownerId: userId,
        details: alert.details ?? {},
      },
    });
  }
  async update(userId: string, alert: Alert) {
    return await db.alert.update({
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
    return await db.alert.delete({ where: { id, ownerId: userId } });
  }
}
