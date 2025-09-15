import { cookies } from "next/headers";

const SESSION_COOKIE = "session_data";
const SESSION_TTL_DAYS = 7;

export async function setSession(phone: string, token: string, admin: any) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({ phone, token, admin });
  cookieStore.set(SESSION_COOKIE, sessionData, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionData) return null;
  
  try {
    const { admin } = JSON.parse(sessionData);
    return admin;
  } catch {
    return null;
  }
}
