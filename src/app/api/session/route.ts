import { NextResponse } from "next/server";
import { getSessionUser, clearSession, setSession } from "@/lib/auth-server";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user });
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ success: true });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { token, admin, phone } = body || {};
  
  if (!token || !admin || !phone) {
    return NextResponse.json({ error: "Token, admin data, and phone required" }, { status: 400 });
  }
  
  await setSession(phone, token, admin);
  return NextResponse.json({ success: true });
}

