import type { ReportMeta } from "./reports";

/** Only exact manifest entries are accessible; no arbitrary Blob paths. */
export function handoffFile(meta: ReportMeta, path: string) {
  if (meta.kind !== "handoff" || !meta.handoff) return null;
  if (!path || path.split("/").some(p => !p || p === "." || p === "..") || path.includes("\\")) return null;
  return meta.handoff.files.find(f => f.path === path) ?? null;
}

export function handoffType(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  return ({png:"image/png", jpg:"image/jpeg", jpeg:"image/jpeg", webp:"image/webp", svg:"image/svg+xml", zip:"application/zip", md:"text/plain; charset=utf-8", json:"application/json", html:"text/html; charset=utf-8", css:"text/css; charset=utf-8"} as Record<string,string>)[ext ?? ""] ?? "application/octet-stream";
}
