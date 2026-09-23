import { get, put } from "@vercel/blob";
import type { ReportMeta } from "./reports";

const ACCESS = "private" as const;
const path = (host: string, file: string) => `reports/${host}/${file}`;

export async function saveReport(host: string, meta: ReportMeta, pdf: Buffer, fix: Buffer) {
  const opts = { access: ACCESS, addRandomSuffix: false, allowOverwrite: true };
  await Promise.all([
    put(path(host, "meta.json"), JSON.stringify(meta), { ...opts, contentType: "application/json" }),
    put(path(host, "report.pdf"), pdf, { ...opts, contentType: "application/pdf" }),
    put(path(host, "fix.md"), fix, { ...opts, contentType: "text/markdown" }),
  ]);
}

export async function readMeta(host: string): Promise<ReportMeta | null> {
  const r = await get(path(host, "meta.json"), { access: ACCESS, useCache: false });
  if (!r || r.statusCode !== 200) return null;
  return (await new Response(r.stream).json()) as ReportMeta;
}

export async function readFile(host: string, file: "report.pdf" | "fix.md"): Promise<ReadableStream | null> {
  const r = await get(path(host, file), { access: ACCESS, useCache: false });
  if (!r || r.statusCode !== 200) return null;
  return r.stream;
}
