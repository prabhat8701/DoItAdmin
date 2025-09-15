import { NextResponse } from "next/server";
import { generateAndStoreOtp, getUserByPhone } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const phone = body?.phone?.toString().trim();
  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }
  const user = getUserByPhone(phone);
  if (!user) {
    return NextResponse.json({ error: "User not found. Please sign up." }, { status: 404 });
  }
  const otp = generateAndStoreOtp(phone);
  // In real life, send SMS. For demo, return code in response for convenience.
  return NextResponse.json({ success: true, code: otp.code });
}

