import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPresignedUploadUrl } from "@/lib/r2-presign";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  FILE_RULES,
} from "@/lib/file-config";
import { randomUUID } from "crypto";

type RequestedFile = {
  field: string;
  name: string;
  type: string;
  size: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      submissionId,
      files,
    }: {
      submissionId: string;
      files: RequestedFile[];
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Files are required",
        },
        { status: 400 }
      );
    }

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

    if (submission.status !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          message: "Submission is no longer accepting uploads",
        },
        { status: 400 }
      );
    }

    const uploadedFiles = [];

    for (const file of files) {
      const rule = FILE_RULES[file.field];

      if (!rule) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid file field: ${file.field}`,
          },
          { status: 400 }
        );
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name}: unsupported file type`,
          },
          { status: 400 }
        );
      }

      if (file.size <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name}: invalid file size`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name}: maximum size is 5MB`,
          },
          { status: 400 }
        );
      }

      const extension =
        file.name.split(".").pop()?.toLowerCase() || "bin";

      const key =
        `submissions/${submissionId}/` +
        `${file.field}/${randomUUID()}.${extension}`;

      const uploadUrl = await createPresignedUploadUrl({
        key,
        contentType: file.type,
      });

      uploadedFiles.push({
        field: file.field,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        key,
        uploadUrl,
      });
    }

    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: "UPLOADING",
      },
    });

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Presign error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to generate upload URLs",
      },
      { status: 500 }
    );
  }
}