import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Mock endpoint for build
  return NextResponse.json({ url: "https://stripe.com/portal" });
}
