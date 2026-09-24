import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookieAllowed, loadMeta } from "@/lib/access";
import { readFile } from "@/lib/storage";
import { unlock } from "./actions";
import { ReportView } from "./report-view";

export const dynamic = "force-dynamic";
type Props = {
  params: Promise<{ host: string }>;
  searchParams: Promise<{ wrong?: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host } = await params;
  return {
    title: `Report for ${host}`,
    robots: { index: false, follow: false },
  };
}
export default async function ReportPage({ params, searchParams }: Props) {
  const { host } = await params;
  const { wrong } = await searchParams;
  const meta = await loadMeta(host);
  if (!meta) notFound();
  const open = await cookieAllowed(meta);
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
    />
  );
}
