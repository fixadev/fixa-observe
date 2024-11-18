import { db } from "~/server/db";
import { TestService } from "~/server/services/test";
import { z } from "zod";
import { type NextRequest } from "next/server";
import { getUserIdFromApiKey } from "~/lib/server-utils";

const testService = new TestService(db);

const inputSchema = z.object({
  agentId: z.string(),
  scenarioIds: z.array(z.string()).optional(),
  testAgentIds: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromApiKey(req);
  if (!userId) {
    return Response.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body: unknown = await req.json();
    let input: z.infer<typeof inputSchema>;

    try {
      input = inputSchema.parse(body);
    } catch (error) {
      return Response.json(
        {
          success: false,
          error:
            error instanceof z.ZodError
              ? error.errors
                  .map((err) => `${err.path.join(".")}: ${err.message}`)
                  .join(", ")
              : "Invalid input format",
        },
        { status: 400 },
      );
    }

    // Check that the user has access to the agent
    const agent = await db.agent.findFirst({
      where: { id: input.agentId, ownerId: userId },
    });
    if (!agent) {
      return Response.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const result = await testService.run(
      input.agentId,
      input.scenarioIds,
      input.testAgentIds,
    );
    return Response.json({ success: true, data: { testId: result.id } });
  } catch (error) {
    console.error("Error running test:", error);
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
