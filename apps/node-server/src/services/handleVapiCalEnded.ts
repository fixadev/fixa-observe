import { CallResult } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";

export const handleVapiCallEnded = async (
  body: ServerMessageEndOfCallReport,
) => {
  const callId = body?.call?.id;
  if (!callId) {
    console.error("No call ID found in Vapi call ended message");
    return;
  }
  const relevantTest = await db.test.findFirst({
    where: { inProgressCallIds: { has: callId } },
  });

  if (!relevantTest) return;
  const updatedInProgressCallIds = relevantTest.inProgressCallIds.filter(
    (id) => id !== callId,
  );

  console.log("VAPI CALL ENDED", body);
  // await db.test.update({
  //   where: { id: relevantTest.id },
  //   data: {
  //     inProgressCallIds: updatedInProgressCallIds,
  //     completedCalls: {
  //       create: {
  //         id: callId,
  //         result: CallResult.SUCCESS,
  //         failureReason: null,
  //         messages: {
  //           createMany: {
  //             data: body.call?.messages?.map((message) => ({
  //               speaker: message.,
  //               text: message.text,
  //               start: message.start,
  //               end: message.end,
  //             })),
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
};
