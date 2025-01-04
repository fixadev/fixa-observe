import { OrgService } from "@repo/services/src";
import { db } from "../db";

const userServiceClient = new OrgService(db);

export default userServiceClient;
