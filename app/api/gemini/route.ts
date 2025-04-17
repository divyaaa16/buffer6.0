import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    // Return a static canned response instead of calling any API
    return NextResponse.json({ response: `You asked: "${prompt}". [This is a static placeholder reply.]` });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error", details: String(error) }, { status: 500 });
  }
}
