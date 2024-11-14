import { db } from "~/server/db";
import { TestService } from "~/server/services/test";
import { z } from "zod";
import { type NextRequest } from "next/server";

const testService = new TestService(db);

const inputSchema = z.object({
  agentId: z.string(),
  scenarioIds: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
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

    const result = await testService.run(input.agentId, input.scenarioIds);
    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error("Error running test:", error);
    return Response.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
