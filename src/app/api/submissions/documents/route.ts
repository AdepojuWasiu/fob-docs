import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkR2Object } from "@/lib/r2";
import { FILE_RULES } from "@/lib/file-config";
import { getR2Url } from "@/lib/r2";

type UploadedDocument = {
  field: string;
  originalName: string;
  mimeType: string;
  size: number;
  key: string;
};

export async function POST(request: NextRequest) {
  const createdKeys: string[] = [];

  try {
    const body = await request.json();

    const {
      submissionId,
      documents,
    }: {
      submissionId: string;
      documents: UploadedDocument[];
    } = body;

    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
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

    if (
      submission.status !== "UPLOADING" &&
      submission.status !== "DRAFT"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission cannot accept documents",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No documents supplied",
        },
        { status: 400 }
      );
    }

    const verifiedDocuments = [];

    for (const document of documents) {
      const rule = FILE_RULES[document.field];

      if (!rule) {
        throw new Error(
          `Invalid document field: ${document.field}`
        );
      }

      if (!document.key.startsWith(`submissions/${submissionId}/`)) {
        throw new Error("Invalid R2 object key");
      }

      const object = await checkR2Object(document.key);

      if (!object.exists) {
        throw new Error(
          `File does not exist in storage: ${document.originalName}`
        );
      }

      if (object.size !== document.size) {
        throw new Error(
          `File size mismatch: ${document.originalName}`
        );
      }

      if (
        object.contentType &&
        object.contentType !== document.mimeType
      ) {
        throw new Error(
          `File type mismatch: ${document.originalName}`
        );
      }

      const documentType =
        document.field === "picture" &&
        submission.type === "GUARANTOR"
          ? "GUARANTOR_PICTURE"
          : rule.documentType;

      verifiedDocuments.push({
        submissionId,
        type: documentType,
        fileName: document.key.split("/").pop()!,
        originalName: document.originalName,
        mimeType: document.mimeType,
        size: document.size,
        r2Key: document.key,
        url: getR2Url(document.key),
        status: "VERIFIED" as const,
      });

      createdKeys.push(document.key);
    }

    await prisma.$transaction(
      verifiedDocuments.map((document) =>
        prisma.document.create({
          data: document,
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: "Documents verified and saved",
    });
  } catch (error) {
    console.error("Save documents error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to save documents",
      },
      { status: 500 }
    );
  }
}