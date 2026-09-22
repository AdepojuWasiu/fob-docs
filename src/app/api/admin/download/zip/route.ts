import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSubmissionDocuments } from "@/lib/admin-data-server";
import { getR2ObjectBuffer } from "@/lib/r2-download";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const submissionId = request.nextUrl.searchParams.get("submissionId");
  if (!submissionId) return NextResponse.json({ message: "Missing submission ID" }, { status: 400 });
  const documents = await getSubmissionDocuments(submissionId);
  if (!documents.length) return NextResponse.json({ message: "No documents found" }, { status: 404 });
  const zip = new JSZip();
  for (const document of documents) zip.file(document.originalName, await getR2ObjectBuffer(document.r2Key));
  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(buffer.length),
      "Content-Disposition": `attachment; filename="submission-${submissionId}.zip"`,
      "Cache-Control": "private, no-store",
    },
  });
}
