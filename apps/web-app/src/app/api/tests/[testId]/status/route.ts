import { NextResponse } from "next/server";
import { TestService } from "~/server/services/test";
import { db } from "~/server/db";

const testService = new TestService(db);

export async function GET(
  request: Request,
  { params }: { params: { testId: string } },
) {
  try {
    const testId = params.testId;
    const status = await testService.getStatus(testId);

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error fetching test status:", error);
    return NextResponse.json(
      { error: "Failed to fetch test status" },
      { status: 500 },
    );
  }
}
