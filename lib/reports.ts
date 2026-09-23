import { createHash, createHmac, randomInt, timingSafeEqual } from "node:crypto";

export const HOST_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
export const CODE_RE = /^\d{6}$/;

/** Lowercase letters, digits, dots and hyphens only; no leading/trailing dot or hyphen. */
export function isValidHost(host: unknown): host is string {
  return typeof host === "string" && host.length > 0 && host.length <= 253 && HOST_RE.test(host);
}

export function generateCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** Salted hash of the code; the salt is per report so equal codes never share a hash. */
export function hashCode(code: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${code}`).digest("hex");
}

export function verifyCode(code: unknown, salt: string, expectedHash: string): boolean {
  if (typeof code !== "string" || !CODE_RE.test(code)) return false;
  const a = Buffer.from(hashCode(code, salt), "hex");
  const b = Buffer.from(expectedHash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Cookie value proving the code was entered: HMAC over host + the report hash, so a re-upload invalidates it. */
export function sessionToken(host: string, codeHash: string, secret: string): string {
  return createHmac("sha256", secret).update(`${host}:${codeHash}`).digest("hex");
}

export function verifySessionToken(token: unknown, host: string, codeHash: string, secret: string): boolean {
  if (typeof token !== "string" || token.length !== 64) return false;
  const a = Buffer.from(token, "hex");
  const b = Buffer.from(sessionToken(host, codeHash, secret), "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function cookieName(host: string): string {
  return `r_${host.replace(/[^a-z0-9]/g, "_")}`;
}

export type ReportMeta = {
  host: string;
  kind: "page" | "pages";
  pages: number;
  summary: string;
  codeHash: string;
  salt: string;
  createdAt: string;
};

/** Small in-memory rate limit per key. Resets per server instance; enough to slow a 6-digit guess. */
const buckets = new Map<string, { count: number; resetAt: number }>();
export function rateLimited(key: string, limit = 10, windowMs = 10 * 60_000, now = Date.now()): boolean {
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  b.count += 1;
  return b.count > limit;
}
export function resetRateLimits() {
  buckets.clear();
}
