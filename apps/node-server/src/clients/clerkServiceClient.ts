import { ClerkService } from "@repo/services/src/index";
import { db } from "../db";

export const clerkServiceClient = new ClerkService(db);
