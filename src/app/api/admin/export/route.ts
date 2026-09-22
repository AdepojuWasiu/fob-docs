import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminRecords } from "@/lib/admin-data-server";
import type { RecordKind } from "@/lib/admin-data";

const escapeCsv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const requestedKind = request.nextUrl.searchParams.get("kind");
  const kinds: RecordKind[] = requestedKind === "employees" || requestedKind === "guarantors" ? [requestedKind] : ["employees", "guarantors"];
  const records = (await Promise.all(kinds.map((kind) => getAdminRecords(kind)))).flat();
  const header = ["ID", "Name", "Email", "Phone", "Location", "Status", "Submitted", "Role", "Department"];
  const rows = records.map((record) => [record.id, record.name, record.email, record.phone, record.location, record.status, record.submittedAt, record.role, record.department]);
  const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="fob-${requestedKind || "admin"}-report.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
