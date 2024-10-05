import { type NextRequest } from "next/server";

export async function GET() {
  return new Response("ok", { status: 200 });
}

export async function POST(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const validationToken = searchParams.get("validationToken");

  if (validationToken) {
    return new Response(validationToken, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.log("microsoft webhook", JSON.stringify(await req.json(), null, 2));
  return new Response("ok", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
