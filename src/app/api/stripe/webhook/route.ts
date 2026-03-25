import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Mock webhook handler for build
  return NextResponse.json({ received: true });
}

export const runtime = "nodejs";
