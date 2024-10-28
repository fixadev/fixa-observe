import { NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number");

  if (!number || isNaN(Number(number))) {
    return new NextResponse("Invalid number parameter", { status: 400 });
  }

  // Create a 32x32 blue circle with white text
  const svgBuffer = Buffer.from(`
    <svg width="32" height="32">
      <circle cx="16" cy="16" r="16" fill="#046bb6"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dy=".3em" 
        fill="white" 
        font-size="16"
        font-family="Arial"
      >${number}</text>
    </svg>
  `);

  try {
    const pngBuffer = await sharp(svgBuffer).png().toBuffer();

    return new NextResponse(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating pin:", error);
    return new NextResponse("Error generating pin", { status: 500 });
  }
}
