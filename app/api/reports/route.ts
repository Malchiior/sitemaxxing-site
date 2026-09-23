import { NextResponse } from "next/server";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { generateCode, hashCode, isValidHost, type ReportMeta } from "@/lib/reports";
import { saveReport } from "@/lib/storage";

export const runtime = "nodejs";
const MAX_FILE = 3 * 1024 * 1024;

function authorized(req: Request): boolean {
  const key = process.env.REPORT_KEY;
  const header = req.headers.get("authorization") ?? "";
  if (!key || !header.startsWith("Bearer ")) return false;
  const a = Buffer.from(header.slice(7));
  const b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

type FileIn = { name?: unknown; type?: unknown; base64?: unknown };

export async function PUT(req: Request) {
  if (!authorized(req)) return new NextResponse(null, { status: 401 });

  let body: { host?: unknown; kind?: unknown; pages?: unknown; summary?: unknown; files?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { host, kind, pages, summary, files } = body;
  if (!isValidHost(host)) return NextResponse.json({ error: "invalid host" }, { status: 400 });
  if (kind !== "page" && kind !== "pages") return NextResponse.json({ error: "invalid kind" }, { status: 400 });
  if (typeof pages !== "number" || !Number.isInteger(pages) || pages < 1 || pages > 50)
    return NextResponse.json({ error: "invalid pages" }, { status: 400 });
  if (typeof summary !== "string" || summary.length > 20_000)
    return NextResponse.json({ error: "invalid summary" }, { status: 400 });
  if (!Array.isArray(files)) return NextResponse.json({ error: "invalid files" }, { status: 400 });

  let pdf: Buffer | null = null;
  let fix: Buffer | null = null;
  for (const f of files as FileIn[]) {
    if (typeof f?.base64 !== "string" || typeof f?.type !== "string") continue;
    const buf = Buffer.from(f.base64, "base64");
    if (buf.length === 0 || buf.length > MAX_FILE) return NextResponse.json({ error: "file too large" }, { status: 413 });
    if (f.type === "application/pdf") pdf = buf;
    else if (f.type === "text/markdown") fix = buf;
  }
  if (!pdf || !fix) return NextResponse.json({ error: "need one pdf and one markdown file" }, { status: 400 });

  const code = generateCode();
  const salt = randomBytes(16).toString("hex");
  const meta: ReportMeta = {
    host,
    kind,
    pages,
    summary,
    salt,
    codeHash: hashCode(code, salt),
    createdAt: new Date().toISOString(),
  };
  await saveReport(host, meta, pdf, fix);

  const origin = process.env.SITE_URL ?? new URL(req.url).origin;
  return NextResponse.json({ url: `${origin}/r/${host}`, code });
}
