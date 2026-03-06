import { NextResponse } from "next/server";

// Mock auth route for static build
export async function GET() {
  return NextResponse.json({ message: "Auth not configured" }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: "Auth not configured" }, { status: 501 });
}
