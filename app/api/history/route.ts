import { NextRequest, NextResponse } from "next/server";

// Mock database for demonstration. Replace with your real DB logic.
const mockDb: Record<string, any[]> = {
  "user123": [
    {
      id: "complaint1",
      title: "Harassment at Workplace",
      description: "Filed a complaint about workplace harassment.",
      date: "2025-04-17",
      status: "In Progress"
    }
  ],
  "user456": [
    {
      id: "complaint2",
      title: "Stalking Incident",
      description: "Reported a stalking incident.",
      date: "2025-04-10",
      status: "Resolved"
    }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  // In production, fetch from your real database using uid
  const history = uid && mockDb[uid] ? mockDb[uid] : [];

  return NextResponse.json(history);
}
