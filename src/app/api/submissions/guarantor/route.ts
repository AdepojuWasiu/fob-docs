import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const submission = await prisma.submission.create({
      data: {
        type: "GUARANTOR",
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      {
        success: true,
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create guarantor submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create submission",
      },
      { status: 500 }
    );
  }
}