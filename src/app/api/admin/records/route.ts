import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminRecords } from "@/lib/admin-data-server";
import type { RecordKind } from "@/lib/admin-data";

export async function GET(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const kind = request.nextUrl.searchParams.get("kind") as RecordKind;
  if (kind !== "employees" && kind !== "guarantors") return NextResponse.json({ message: "Invalid record kind" }, { status: 400 });
  const records = await getAdminRecords(kind, request.nextUrl.searchParams.get("query") || "", request.nextUrl.searchParams.get("status") || "All status");
  return NextResponse.json({ records });
}
