import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { handler } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    // Get the session to access the OAuth token
    const session = await getServerSession(handler);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch YouTube channel data using the OAuth token
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&mine=true",
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("YouTube API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch YouTube data", details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return NextResponse.json(
        { error: "No YouTube channel found" },
        { status: 404 }
      );
    }

    const channel = data.items[0];
    const stats = channel.statistics;
    const snippet = channel.snippet;

    return NextResponse.json({
      platform: "youtube",
      channelId: channel.id,
      title: snippet.title,
      description: snippet.description,
      thumbnail: snippet.thumbnails?.default?.url,
      subscribers: parseInt(stats.subscriberCount || "0"),
      views: parseInt(stats.viewCount || "0"),
      videos: parseInt(stats.videoCount || "0"),
    });
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
