import { NextRequest, NextResponse } from "next/server";
import { markSubmissionFailed } from "@/lib/mark-submission-failed";

export async function POST(request: NextRequest) {
  try {
    const { submissionId, reason } = await request.json();
    await markSubmissionFailed(submissionId, reason);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark submission failed error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to mark submission as failed" },
      { status: 500 }
    );
  }
}