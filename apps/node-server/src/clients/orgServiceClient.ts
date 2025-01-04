import { OrgService } from "@repo/services/src/index";
import { db } from "../db";

export const orgServiceClient = new OrgService(db);
