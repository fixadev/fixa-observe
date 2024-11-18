import { type NextRequest, NextResponse } from "next/server";
import { TestService } from "~/server/services/test";
import { db } from "~/server/db";
import { getUserIdFromApiKey } from "~/lib/server-utils";

const testService = new TestService(db);

export async function GET(
  req: NextRequest,
  { params }: { params: { testId: string } },
) {
  const userId = await getUserIdFromApiKey(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const testId = params.testId;

    // Check that the user has access to the test
    const test = await db.test.findFirst({
      where: { id: testId, agent: { ownerId: userId } },
    });
    if (!test) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const statusResult = await testService.getStatus(testId);

    return NextResponse.json(statusResult);
  } catch (error) {
    console.error("Error fetching test status:", error);
    return NextResponse.json(
      { error: "Failed to fetch test status" },
      { status: 500 },
    );
  }
}
