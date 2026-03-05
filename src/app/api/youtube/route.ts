import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Fetch YouTube channel data
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube data");
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "No channel found" }, { status: 404 });
    }

    const channel = data.items[0];
    const stats = channel.statistics;
    const snippet = channel.snippet;

    return NextResponse.json({
      platform: "youtube",
      channelId: channel.id,
      title: snippet.title,
      thumbnail: snippet.thumbnails?.default?.url,
      subscribers: parseInt(stats.subscriberCount) || 0,
      views: parseInt(stats.viewCount) || 0,
      videos: parseInt(stats.videoCount) || 0,
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch YouTube data" },
      { status: 500 }
    );
  }
}
