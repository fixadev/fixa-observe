import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { VapiService } from "@repo/services/src/vapi";

VapiService;
// Schema for validating VAPI webhook payload
const EndOfCallReportSchema = z.object({
  call: z.object({
    id: z.string(),
    customer: z.object({
      number: z.string(),
    }),
  }),
  // from: z.string(),
  // to: z.string(),
  // duration: z.number(),
  // status: z.string(),
  // recording_url: z.string().optional(),
});

type EndOfCallReport = z.infer<typeof EndOfCallReportSchema>;

const OPENPHONE_API_KEY = process.env.OPENPHONE_API_KEY;
const OPENPHONE_FROM_NUMBER = process.env.OPENPHONE_FROM_NUMBER;

export async function POST(request: Request) {
  try {
    // Parse and validate the webhook payload
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = await request.json();
    const report = EndOfCallReportSchema.parse(payload);

    // Format message for the caller
    // const message = `Thank you for your call! Your call lasted ${Math.round(report.duration / 60)} minutes. ${
    //   report.recording_url ? "A recording is available for your reference." : ""
    // }`;
    const message =
      "Hi, this is Colette, thanks again for calling. Please be patient as we find someone who we think you might be interested in talking to. In the meantime, let me know if you have any questions about our process!";

    // Send text via OpenPhone API
    const response = await fetch("https://api.openphone.com/v2/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENPHONE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: OPENPHONE_FROM_NUMBER,
        to: report.call.customer.number,
        text: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenPhone API error: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
