import { get } from "@vercel/blob";
import { codeAllowed, cookieAllowed, loadMeta } from "@/lib/access";
import { handoffFile, handoffType } from "@/lib/handoff";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{host:string; path:string[]}> }) {
  const {host, path} = await ctx.params;
  const meta = await loadMeta(host);
  if (!meta || (!(await cookieAllowed(meta)) && !(await codeAllowed(meta, new URL(req.url).searchParams.get("code")))))
    return new Response(null, {status:403, headers:{"Cache-Control":"no-store"}});
  const name = path.join("/");
  const file = handoffFile(meta, name);
  if (!file) return new Response(null, {status:404});
  const result = await get(`${meta.handoff!.prefix}/${name}`, {access:"private", useCache:false});
  if (!result || result.statusCode !== 200) return new Response(null, {status:404});
  return new Response(result.stream, {headers:{
    "Content-Type":handoffType(name),
    "Content-Disposition":`${name.endsWith('.zip') ? 'attachment' : 'inline'}; filename="${name.split('/').pop()!.replace(/[^a-zA-Z0-9._-]/g,'_')}"`,
    "Cache-Control":"private, no-store", "X-Robots-Tag":"noindex, nofollow", "X-Content-Type-Options":"nosniff",
    "Referrer-Policy":"no-referrer",
    // Standalone HTML/SVG assets cannot run scripts or access this origin.
    "Content-Security-Policy":"sandbox; default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline' 'self'; font-src 'self'; base-uri 'none'; form-action 'none'",
  }});
}
