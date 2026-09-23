import { cookies, headers } from "next/headers";
import { cookieName, isValidHost, rateLimited, verifyCode, verifySessionToken, type ReportMeta } from "./reports";
import { readMeta } from "./storage";

export function secret(): string {
  return process.env.REPORT_KEY ?? "";
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/** Meta for a host, or null when the host is invalid or has no report. */
export async function loadMeta(host: string): Promise<ReportMeta | null> {
  if (!isValidHost(host)) return null;
  return readMeta(host);
}

/** True when ?code= matches; rate limited per IP. */
export async function codeAllowed(meta: ReportMeta, code: string | null): Promise<boolean> {
  if (!code) return false;
  if (rateLimited(`code:${await clientIp()}`)) return false;
  return verifyCode(code, meta.salt, meta.codeHash);
}

export async function cookieAllowed(meta: ReportMeta): Promise<boolean> {
  const c = await cookies();
  return verifySessionToken(c.get(cookieName(meta.host))?.value, meta.host, meta.codeHash, secret());
}
