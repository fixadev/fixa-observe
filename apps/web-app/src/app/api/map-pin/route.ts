import { NextResponse } from "next/server";
import sharp from "sharp";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number");
  const size = searchParams.get("size") ?? "32";

  if (!number || isNaN(Number(number))) {
    return new NextResponse("Invalid number parameter", { status: 400 });
  }

  if (isNaN(Number(size))) {
    return new NextResponse("Invalid size parameter", { status: 400 });
  }

  const sizeNum = Number(size);
  const fontSize = Math.floor(sizeNum / 2);
  const radius = sizeNum / 2;

  // Create a circle with white text
  const svgBuffer = Buffer.from(`
    <svg width="${sizeNum}" height="${sizeNum}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#046bb6"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dy=".3em" 
        fill="white" 
        font-size="${fontSize}"
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
