import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Mock cron job for build
  return NextResponse.json({
    success: true,
    processed: 0,
    results: [],
    mock: true,
  });
}

export const runtime = "nodejs";
