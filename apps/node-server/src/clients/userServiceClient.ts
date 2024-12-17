import { UserService } from "@repo/services/src/user";
import { db } from "../db";

const userServiceClient = new UserService(db);

export default userServiceClient;
