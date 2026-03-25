import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      youtubeUsername,
      youtubePassword,
      facebookUsername,
      facebookPassword,
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Hash passwords before storing
    const hashedYoutubePassword = youtubePassword
      ? await bcrypt.hash(youtubePassword, 10)
      : null;
    const hashedFacebookPassword = facebookPassword
      ? await bcrypt.hash(facebookPassword, 10)
      : null;

    // Insert into database
    await sql`
      INSERT INTO customers (
        name,
        email,
        phone,
        youtube_username,
        youtube_password,
        facebook_username,
        facebook_password,
        created_at
      ) VALUES (
        ${name},
        ${email},
        ${phone},
        ${youtubeUsername || null},
        ${hashedYoutubePassword},
        ${facebookUsername || null},
        ${hashedFacebookPassword},
        NOW()
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        youtube_username = EXCLUDED.youtube_username,
        youtube_password = EXCLUDED.youtube_password,
        facebook_username = EXCLUDED.facebook_username,
        facebook_password = EXCLUDED.facebook_password,
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving customer data:", error);
    return NextResponse.json(
      { error: "Failed to save data" },
      { status: 500 }
    );
  }
}
