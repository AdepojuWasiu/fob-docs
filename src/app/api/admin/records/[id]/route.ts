import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminRecord } from "@/lib/admin-data-server";
import type { RecordKind } from "@/lib/admin-data";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const kind = request.nextUrl.searchParams.get("kind") as RecordKind;
  if (kind !== "employees" && kind !== "guarantors") return NextResponse.json({ message: "Invalid record kind" }, { status: 400 });
  const record = await getAdminRecord(kind, (await params).id);
  if (!record) return NextResponse.json({ message: "Record not found" }, { status: 404 });
  return NextResponse.json({ record });
}
