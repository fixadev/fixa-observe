import { JsonObject } from "@prisma/client/runtime/library";
import { db } from "../db";

const moveRegionIdToMetadata = async () => {
  const calls = await db.call.findMany({
    where: {
      regionId: {
        not: null,
      },
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
        metadata: newMetadata,
      },
    });
    console.log(`updated call ${call.id}:`, {
      ...updatedCall,
    });
  }
};

moveRegionIdToMetadata();
