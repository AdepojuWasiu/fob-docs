import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSubmissionDocument } from "@/lib/admin-data-server";
import { getR2ObjectBuffer } from "@/lib/r2-download";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const submissionId = request.nextUrl.searchParams.get("submissionId");
  const documentId = request.nextUrl.searchParams.get("documentId");
  const inline = request.nextUrl.searchParams.get("inline") === "1";
  if (!submissionId || !documentId) return NextResponse.json({ message: "Missing download parameters" }, { status: 400 });
  const document = await getSubmissionDocument(documentId, submissionId);
  if (!document) return NextResponse.json({ message: "Document not found" }, { status: 404 });
  const buffer = await getR2ObjectBuffer(document.r2Key);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": document.mimeType,
      "Content-Length": String(buffer.length),
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(document.originalName)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
