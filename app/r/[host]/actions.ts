"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clientIp, loadMeta, secret } from "@/lib/access";
import { cookieName, rateLimited, sessionToken, verifyCode } from "@/lib/reports";

export async function unlock(formData: FormData) {
  const host = String(formData.get("host") ?? "");
  const code = String(formData.get("code") ?? "").replace(/\D/g, "");
  const meta = await loadMeta(host);
  const limited = rateLimited(`unlock:${await clientIp()}`);
  if (!meta || limited || !verifyCode(code, meta.salt, meta.codeHash)) {
    redirect(`/r/${encodeURIComponent(host)}?wrong=1`);
  }
  const c = await cookies();
  c.set(cookieName(host), sessionToken(host, meta.codeHash, secret()), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: `/r/${host}`,
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(`/r/${encodeURIComponent(host)}`);
}
