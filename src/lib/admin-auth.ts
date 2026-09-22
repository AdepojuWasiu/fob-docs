import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "fob_admin_session";

function getConfig() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!email || !password || !secret) {
    throw new Error("ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET must be configured");
  }

  return { email: email.toLowerCase(), password, secret };
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function verifyAdminCredentials(email: string, password: string) {
  const config = getConfig();
  return email.toLowerCase() === config.email && password === config.password;
}

export function createAdminSession(email: string) {
  const { secret } = getConfig();
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `${email.toLowerCase()}.${expiresAt}`;
  return `${payload}.${sign(payload, secret)}`;
}

export function isValidAdminSession(value?: string) {
  if (!value) return false;
const lastDot = value.lastIndexOf(".");
const secondLastDot = value.lastIndexOf(".", lastDot - 1);

if (lastDot === -1 || secondLastDot === -1) {
  return false;
}

  const email = value.slice(0, secondLastDot);
  const expiresAt = value.slice(secondLastDot + 1, lastDot);
  const signature = value.slice(lastDot + 1);


if (!email || !expiresAt || !signature) {
  return false;
}

  const { secret, email: configuredEmail } = getConfig();
  const payload = `${email}.${expiresAt}`;
  const expected = sign(payload, secret);

  if (email !== configuredEmail || Number(expiresAt) < Date.now()) return false;
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("UNAUTHORIZED");
  }
}
