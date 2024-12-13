import { JsonObject } from "@prisma/client/runtime/library";
import { db } from "../db";

const update11xUserId = async () => {
  const calls = await db.call.findMany({
    where: {
      ownerId: "11x",
    },
  });
  for (const call of calls) {
    if (!call.metadata) {
      call.metadata = {};
    }
    const newMetadata = call.metadata as JsonObject;
    newMetadata.regionId = call.regionId;
    const updatedCall = await db.call.update({
      where: {
        id: call.id,
      },
      data: {
        ownerId: "user_2pPJOFVVjZPXE8ho8CI68u5lSCf",
      },
    });
    console.log(`updated call ${call.id}:`, {
      ...updatedCall,
    });
  }
};

update11xUserId();
