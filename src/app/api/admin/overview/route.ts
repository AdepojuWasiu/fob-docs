import { NextResponse } from "next/server";
import { getAdminOverview } from "@/lib/admin-data-server";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAdminOverview());
}
