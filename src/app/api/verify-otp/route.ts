import { NextResponse } from "next/server";
import { verifyOtp, getUserByPhone } from "@/lib/store";
import { setSession } from "@/lib/auth-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = body?.phone?.toString().trim();
  const code = body?.code?.toString().trim();
  if (!phone || !code) {
    return NextResponse.json({ error: "Phone and code required" }, { status: 400 });
  }
  const user = getUserByPhone(phone);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const ok = verifyOtp(phone, code);
  if (!ok) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }
  // Generate a simple token (in production, use a proper JWT or secure token)
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  await setSession(phone, token, user);
  return NextResponse.json({ success: true, user });
}

