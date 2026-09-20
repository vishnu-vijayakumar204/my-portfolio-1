import { cookies } from "next/headers";

// ADMIN_SESSION_SECRET doubles as the session token value itself (rather than
// an HMAC key). This keeps verification a plain string comparison so it also
// works from the Edge-runtime middleware, which can't use Node's `crypto`.
const COOKIE_NAME = "admin_session";

export function verifyPassword(candidate: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password) && candidate === password;
}

export async function createAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  const store = await cookies();
  store.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SESSION_SECRET;
  return Boolean(token) && Boolean(secret) && token === secret;
}

export { COOKIE_NAME as ADMIN_COOKIE_NAME };
