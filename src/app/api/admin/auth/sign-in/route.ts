import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, ADMIN_SESSION_COOKIE, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!verifyAdminCredentials(String(email || ""), String(password || ""))) {
    return NextResponse.json({ success: false, message: "Invalid admin credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createAdminSession(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  return response;
}
