import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminRecordsPage } from "@/lib/admin-data-server";
import type { RecordKind } from "@/lib/admin-data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const kind = request.nextUrl.searchParams.get("kind") as RecordKind;
  if (kind !== "employees" && kind !== "guarantors") return NextResponse.json({ message: "Invalid record kind" }, { status: 400 });
  const query = request.nextUrl.searchParams.get("query") || "";
  const status = request.nextUrl.searchParams.get("status") || "All status";
  const page = Number(request.nextUrl.searchParams.get("page") || "1");
  const pageSize = Number(request.nextUrl.searchParams.get("pageSize") || "4");
  const result = await getAdminRecordsPage(kind, query, status, page, pageSize);
  return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
}
