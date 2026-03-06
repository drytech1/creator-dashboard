import { NextResponse } from "next/server";

export async function GET() {
  // Mock YouTube data for build
  return NextResponse.json({
    platform: "youtube",
    channelId: "mock",
    title: "Mock Channel",
    subscribers: 0,
    views: 0,
    videos: 0,
    mock: true,
  });
}
