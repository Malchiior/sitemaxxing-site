import { codeAllowed, loadMeta } from "@/lib/access";
import { readFile } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: RouteContext<"/r/[host]/fix.md">) {
  const { host } = await ctx.params;
  const meta = await loadMeta(host);
  if (!meta || !(await codeAllowed(meta, new URL(req.url).searchParams.get("code"))))
    return new Response(null, { status: 403 });
  const stream = await readFile(host, "fix.md");
  if (!stream) return new Response(null, { status: 403 });
  return new Response(stream, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "X-Robots-Tag": "noindex", "Cache-Control": "no-store" },
  });
}
