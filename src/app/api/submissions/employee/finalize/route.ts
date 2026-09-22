import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkR2Object, deleteR2Object } from "@/lib/r2";
import { getR2ObjectBuffer } from "@/lib/r2-download";
import { uploadBufferToR2 } from "@/lib/r2-upload-server";
import { generateEmployeePdf } from "@/lib/generate-employee-pdf";
import { getR2Url } from "@/lib/r2";

export async function POST(
  request: NextRequest
) {
  const createdKeys: string[] = [];

  try {
    const { submissionId } =
      await request.json();

    const submission =
      await prisma.submission.findUnique({
        where: {
          id: submissionId,
        },

        include: {
          employee: true,
          documents: true,
        },
      });

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission not found",
        },
        { status: 404 }
      );
    }

    if (!submission.employee) {
      throw new Error(
        "Employee information has not been saved"
      );
    }

    const requiredDocuments = [
      "EMPLOYEE_PICTURE",
      "ACADEMIC_CERTIFICATE",
      "NYSC_CERTIFICATE",
      "BIRTH_CERTIFICATE",
      "OLEVEL_CERTIFICATE",
      "EMPLOYEE_VALID_ID",
    ];

    for (const type of requiredDocuments) {
      const document = submission.documents.find(
        (item) => item.type === type
      );

      if (!document) {
        throw new Error(
          `Required document missing: ${type}`
        );
      }

      const exists = await checkR2Object(
        document.r2Key
      );

      if (!exists.exists) {
        throw new Error(
          `Document no longer exists in storage: ${type}`
        );
      }
    }

    const passport =
      submission.documents.find(
        (item) =>
          item.type === "EMPLOYEE_PICTURE"
      );

    if (!passport) {
      throw new Error(
        "Employee passport is required"
      );
    }

    const passportBuffer =
      await getR2ObjectBuffer(
        passport.r2Key
      );

      const pdfBuffer = await generateEmployeePdf({
        employee: submission.employee,
        passport: passportBuffer,
        passportMimeType: passport.mimeType,
      });

    const pdfKey =
      `submissions/${submissionId}/generated/employee-biodata.pdf`;

    await uploadBufferToR2({
      key: pdfKey,
      buffer: pdfBuffer,
      contentType: "application/pdf",
    });

    createdKeys.push(pdfKey);

    await prisma.$transaction(async (tx) => {
      await tx.document.create({
        data: {
          submissionId,
          type: "GENERATED_EMPLOYEE_PDF",
          fileName: "employee-biodata.pdf",
          originalName: "employee-biodata.pdf",
          mimeType: "application/pdf",
          size: pdfBuffer.length,
          r2Key: pdfKey,
          url: getR2Url(pdfKey),
          status: "VERIFIED",
        },
      });

      await tx.submission.update({
        where: {
          id: submissionId,
        },
        data: {
          status: "SUBMITTED",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Employee submission completed",
    });
  } catch (error) {
    console.error(
      "Finalize employee error:",
      error
    );

    // Cleanup server-created R2 objects
    for (const key of createdKeys) {
      try {
        await deleteR2Object(key);
      } catch (cleanupError) {
        console.error(
          "R2 cleanup failed:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to finalize submission",
      },
      { status: 500 }
    );
  }
}