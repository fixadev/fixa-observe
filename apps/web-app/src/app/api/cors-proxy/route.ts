import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (typeof url !== 'string') {
    return NextResponse.json({ error: 'URL must be a string' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': buffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error('Error fetching PDF:', error)
    return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: 500 })
  }
}