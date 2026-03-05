import { NextResponse } from "next/server";

// Mock data for build time / when database is not available
const mockMetrics: any[] = [];

export async function POST(req: Request) {
  // For now, return mock success to allow build
  // In production, this would save to database
  return NextResponse.json({ success: true, mock: true });
}

export async function GET(req: Request) {
  // For now, return mock data to allow build
  // In production, this would fetch from database
  return NextResponse.json({ metrics: [], mock: true });
}
