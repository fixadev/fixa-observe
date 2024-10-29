import { NextResponse } from "next/server";
<<<<<<< HEAD
import { Resvg } from "@resvg/resvg-js";
=======
import { Resvg, type ResvgRenderOptions } from "@resvg/resvg-js";
>>>>>>> e4eb2868bf2ed0c65ae18ddbf17348a516b5cf76

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const number = searchParams.get("number");
  const size = searchParams.get("size") ?? "32";

  if (!number || isNaN(Number(number))) {
    return new NextResponse("Invalid number parameter", { status: 400 });
  }

  const sizeNum = Number(size);
  const fontSize = Math.floor(sizeNum / 2);
  const radius = sizeNum / 2;

  const svg = `
    <svg width="${sizeNum}" height="${sizeNum}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#046bb6"/>
      <text 
        x="50%" 
        y="50%" 
        text-anchor="middle" 
        dy=".3em" 
        fill="white" 
        font-size="${fontSize}"
<<<<<<< HEAD
        font-family="system-ui"
=======
        font-family="IBM Plex Sans"
>>>>>>> e4eb2868bf2ed0c65ae18ddbf17348a516b5cf76
      >${number}</text>
    </svg>
  `;

<<<<<<< HEAD
  const resvg = new Resvg(svg);
=======
  const options: ResvgRenderOptions = {
    font: {
      fontFiles: [`${process.cwd()}/public/fonts/IBMPlexSans-SemiBold.ttf`],
      loadSystemFonts: false,
      defaultFontFamily: "IBM Plex Sans",
    },
  };

  const resvg = new Resvg(svg, options);

>>>>>>> e4eb2868bf2ed0c65ae18ddbf17348a516b5cf76
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new NextResponse(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
