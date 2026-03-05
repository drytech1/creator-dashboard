import { NextResponse } from "next/server";

export async function GET() {
  // Mock Instagram data for build
  return NextResponse.json({
    platform: "instagram",
    accountId: "mock",
    username: "mock",
    followers: 0,
    following: 0,
    mediaCount: 0,
    recentReach: 0,
    recentImpressions: 0,
    recentMedia: [],
    mock: true,
  });
}
