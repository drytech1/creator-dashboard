import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Only fetch if user logged in via Facebook
    if (session.provider !== "facebook") {
      return NextResponse.json(
        { error: "Instagram requires Facebook login" },
        { status: 400 }
      );
    }

    // Step 1: Get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${session.accessToken}`
    );
    
    if (!pagesRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Facebook pages" },
        { status: 500 }
      );
    }

    const pagesData = await pagesRes.json();
    
    if (!pagesData.data || pagesData.data.length === 0) {
      return NextResponse.json(
        { error: "No Facebook pages found" },
        { status: 404 }
      );
    }

    // Step 2: Get Instagram Business Account from first page
    const page = pagesData.data[0];
    const pageToken = page.access_token;
    
    const igAccountRes = await fetch(
      `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${pageToken}`
    );

    if (!igAccountRes.ok) {
      return NextResponse.json(
        { error: "No Instagram Business account linked" },
        { status: 404 }
      );
    }

    const igAccountData = await igAccountRes.json();
    
    if (!igAccountData.instagram_business_account) {
      return NextResponse.json(
        { error: "No Instagram Business account linked to this page" },
        { status: 404 }
      );
    }

    const igAccountId = igAccountData.instagram_business_account.id;

    // Step 3: Get Instagram account info
    const igInfoRes = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}?fields=username,followers_count,follows_count,media_count&access_token=${pageToken}`
    );

    if (!igInfoRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram data" },
        { status: 500 }
      );
    }

    const igInfo = await igInfoRes.json();

    return NextResponse.json({
      platform: "instagram",
      accountId: igAccountId,
      username: igInfo.username,
      followers: igInfo.followers_count || 0,
      following: igInfo.follows_count || 0,
      mediaCount: igInfo.media_count || 0,
    });
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
