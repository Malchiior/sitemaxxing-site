import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookieAllowed, loadMeta } from "@/lib/access";
import { readFile } from "@/lib/storage";
import { unlock } from "./actions";
import { ReportView } from "./report-view";
import { HandoffView } from "./handoff-view";
import { ProjectHandoffView } from "./project-handoff-view";
import { get } from "@vercel/blob";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ host: string }>;
  searchParams: Promise<{ wrong?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host } = await params;
  const meta = await loadMeta(host);
  return {
    title: meta?.kind === "handoff" ? `${meta.handoff?.title || "Plow"} — implementation handoff` : `Report for ${host}`,
    robots: { index: false, follow: false },
  };
}
export default async function ReportPage({ params, searchParams }: Props) {
  const { host } = await params;
  const { wrong } = await searchParams;
  const meta = await loadMeta(host);
  if (!meta) notFound();
  const open = await cookieAllowed(meta);
  if (meta.kind === "handoff" && meta.handoff && open) {
    const data = await get(`${meta.handoff.prefix}/AGENT-PROMPT.md`, {access:"private", useCache:false});
    const prompt = data?.statusCode === 200 ? await new Response(data.stream).text() : "";
    return meta.handoff.title ? <ProjectHandoffView host={host} meta={meta} prompt={prompt}/> : <HandoffView host={host} meta={meta} prompt={prompt} />;
  }
  // Private report content is only fetched and rendered after authentication.
  const stream = open ? await readFile(host, "fix.md") : null;
  const fix = stream ? await new Response(stream).text() : "";
  return (
    <ReportView
      host={host}
      open={open}
      wrong={Boolean(wrong)}
      summary={open ? meta.summary : ""}
      fix={fix}
      unlockAction={unlock}
      handoff={meta.kind === "handoff"}
      handoffTitle={meta.handoff?.title}
    />
  );
}
