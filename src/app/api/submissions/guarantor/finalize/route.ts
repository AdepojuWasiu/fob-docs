import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkR2Object, deleteR2Object, getR2Url } from "@/lib/r2";
import { getR2ObjectBuffer } from "@/lib/r2-download";
import { uploadBufferToR2 } from "@/lib/r2-upload-server";
import { generateGuarantorPdf } from "@/lib/generate-guarantor-pdf";
import { markSubmissionFailed } from "@/lib/mark-submission-failed";

export async function POST(request: NextRequest) {
  const createdKeys: string[] = [];
  let submissionId: string | undefined;

  try {
    const body = await request.json();
    submissionId = body.submissionId;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, message: "Submission ID is required" },
        { status: 400 }
      );
    }

    const validSubmissionId = submissionId;

    const submission = await prisma.submission.findUnique({
      where: { id: validSubmissionId },
      include: { guarantor: true, documents: true },
    });

    if (!submission) {
      return NextResponse.json({ success: false, message: "Submission not found" }, { status: 404 });
    }

    if (submission.type !== "GUARANTOR" || !submission.guarantor) {
      return NextResponse.json({ success: false, message: "Guarantor information has not been saved" }, { status: 400 });
    }

    const picture = submission.documents.find(
      (item) => item.type === "GUARANTOR_PICTURE"
    );

    for (const type of ["GUARANTOR_VALID_ID", "GUARANTOR_PICTURE", "SIGNATURE"] as const) {
      const document = submission.documents.find((item) => item.type === type);
      if (!document) {
        throw new Error(`Required document missing: ${type}`);
      }
      const exists = await checkR2Object(document.r2Key);
      if (!exists.exists) {
        throw new Error(`Document no longer exists in storage: ${type}`);
      }
    }

    if (!picture) {
      throw new Error("Guarantor passport picture is required");
    }

    const passportBuffer = await getR2ObjectBuffer(picture.r2Key);
    const pdfBuffer = await generateGuarantorPdf({
      guarantor: submission.guarantor,
      passport: passportBuffer,
      passportMimeType: picture.mimeType,
    });
    const pdfKey = `submissions/${submissionId}/generated/guarantor-form.pdf`;
    await uploadBufferToR2({ key: pdfKey, buffer: pdfBuffer, contentType: "application/pdf" });
    createdKeys.push(pdfKey);

    await prisma.$transaction(async (tx) => {
      await tx.document.create({
        data: {
          submissionId: validSubmissionId,
          type: "GENERATED_GUARANTOR_PDF",
          fileName: "guarantor-form.pdf",
          originalName: "guarantor-form.pdf",
          mimeType: "application/pdf",
          size: pdfBuffer.length,
          r2Key: pdfKey,
          url: getR2Url(pdfKey),
          status: "VERIFIED",
        },
      });
      await tx.submission.update({ where: { id: validSubmissionId }, data: { status: "SUBMITTED" } });
    });

    return NextResponse.json({ success: true, message: "Guarantor submission completed" });
  } catch (error) {
    console.error("Finalize guarantor error:", error);
    await markSubmissionFailed(
      submissionId,
      error instanceof Error
        ? error.message
        : "Unable to finalize guarantor submission"
    );
    for (const key of createdKeys) {
      try {
        await deleteR2Object(key);
      } catch (cleanupError) {
        console.error("R2 cleanup failed:", cleanupError);
      }
    }
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to finalize submission" },
      { status: 500 }
    );
  }
}