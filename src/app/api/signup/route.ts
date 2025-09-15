import { NextResponse } from "next/server";
import { ensureUserExists } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = body?.name?.toString().trim();
  const phone = body?.phone?.toString().trim();
  const email = body?.email?.toString().trim();

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = ensureUserExists(name, phone, email);
  return NextResponse.json({ user });
}

