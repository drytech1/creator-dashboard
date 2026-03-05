import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Step 1: Get Facebook Pages the user manages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${session.accessToken}`
    );

    if (!pagesResponse.ok) {
      throw new Error("Failed to fetch Facebook pages");
    }

    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json(
        { error: "No Facebook pages found. You need a Facebook page connected to your Instagram account." },
        { status: 404 }
      );
    }

    // Step 2: Get Instagram Business Account ID from the first page
    const page = pagesData.data[0];
    const pageId = page.id;
    const pageAccessToken = page.access_token;

    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
    );

    if (!igAccountResponse.ok) {
      throw new Error("Failed to fetch Instagram account");
    }

    const igAccountData = await igAccountResponse.json();

    if (!igAccountData.instagram_business_account) {
      return NextResponse.json(
        { error: "No Instagram Business account connected to this Facebook page" },
        { status: 404 }
      );
    }

    const igBusinessId = igAccountData.instagram_business_account.id;

    // Step 3: Get Instagram account info and metrics
    const igInfoResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igBusinessId}?fields=username,followers_count,follows_count,media_count,profile_picture_url&access_token=${pageAccessToken}`
    );

    if (!igInfoResponse.ok) {
      throw new Error("Failed to fetch Instagram info");
    }

    const igInfo = await igInfoResponse.json();

    // Step 4: Get recent media insights
    const mediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igBusinessId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=10&access_token=${pageAccessToken}`
    );

    const mediaData = await mediaResponse.json();

    // Calculate total reach/impressions from recent media (if available)
    let totalReach = 0;
    let totalImpressions = 0;

    if (mediaData.data) {
      for (const media of mediaData.data.slice(0, 5)) {
        try {
          const insightsResponse = await fetch(
            `https://graph.facebook.com/v18.0/${media.id}/insights?metric=reach,impressions&access_token=${pageAccessToken}`
          );
          const insights = await insightsResponse.json();
          
          if (insights.data) {
            insights.data.forEach((insight: any) => {
              if (insight.name === "reach" && insight.values[0]) {
                totalReach += insight.values[0].value || 0;
              }
              if (insight.name === "impressions" && insight.values[0]) {
                totalImpressions += insight.values[0].value || 0;
              }
            });
          }
        } catch (e) {
          // Some media may not have insights
        }
      }
    }

    return NextResponse.json({
      platform: "instagram",
      accountId: igBusinessId,
      username: igInfo.username,
      profilePicture: igInfo.profile_picture_url,
      followers: igInfo.followers_count || 0,
      following: igInfo.follows_count || 0,
      mediaCount: igInfo.media_count || 0,
      recentReach: totalReach,
      recentImpressions: totalImpressions,
      recentMedia: mediaData.data?.slice(0, 5) || [],
    });
  } catch (error) {
    console.error("Instagram API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram data" },
      { status: 500 }
    );
  }
}
