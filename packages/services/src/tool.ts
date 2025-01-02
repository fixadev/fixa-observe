import { PrismaClient, Role } from "@repo/db/src";

export class ToolService {
  constructor(private db: PrismaClient) {}

  async createToolCall({
    callId,
    toolName,
    timestamp,
    result,
  }: {
    callId: string;
    toolName: string;
    timestamp: Date;
    result: string;
  }) {
    return await this.db.message.create({
      data: {
        callId,
        role: Role.tool_call_result,
        time: timestamp.getTime(),
        endTime: timestamp.getTime(),

        name: toolName,
        result,
      },
    });
  }
}
