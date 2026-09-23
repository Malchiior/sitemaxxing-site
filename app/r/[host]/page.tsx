import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookieAllowed, loadMeta } from "@/lib/access";
import { readFile } from "@/lib/storage";
import { unlock } from "./actions";
import { CopyBox } from "./copy-box";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ host: string }>; searchParams: Promise<{ wrong?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { host } = await params;
  return { title: `Report for ${host}`, robots: { index: false, follow: false } };
}

export default async function ReportPage({ params, searchParams }: Props) {
  const { host } = await params;
  const { wrong } = await searchParams;
  const meta = await loadMeta(host);
  if (!meta) notFound();

  const open = await cookieAllowed(meta);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="text-sm font-medium uppercase tracking-wide text-coral">Sitemaxxing fit check</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Report for {host}</h1>

      {!open ? (
        <form action={unlock} className="mt-8 rounded-xl border border-coral/40 bg-white/5 p-5 sm:p-6">
          <input type="hidden" name="host" value={host} />
          <label htmlFor="code" className="block text-cream/80">
            Enter the 6-digit code from your text
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="code"
              name="code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              autoComplete="one-time-code"
              required
              className="w-full rounded-lg border border-white/20 bg-navy px-4 py-3 font-mono text-lg tracking-widest text-cream sm:w-48"
            />
            <button type="submit" className="rounded-lg bg-coral px-5 py-3 font-semibold text-navy">
              Open report
            </button>
          </div>
          {wrong ? <p className="mt-3 text-sm text-coral">Wrong code.</p> : null}
        </form>
      ) : (
        <Unlocked host={host} summary={meta.summary} />
      )}
    </main>
  );
}

async function Unlocked({ host, summary }: { host: string; summary: string }) {
  const stream = await readFile(host, "fix.md");
  const fix = stream ? await new Response(stream).text() : "";
  const base = `/r/${host}`;
  return (
    <>
      <pre className="mt-8 whitespace-pre-wrap rounded-xl border border-white/10 bg-white/5 p-5 font-sans text-cream/90">
        {summary}
      </pre>
      <a href={`${base}/report.pdf`} className="mt-6 inline-block rounded-lg bg-coral px-5 py-3 font-semibold text-navy">
        Download PDF
      </a>
      <h2 className="mt-12 text-2xl font-semibold">Fix list</h2>
      <CopyBox text={fix} />
      <p className="mt-6 text-sm text-cream/70">
        Give your coding agent this link and code, or the PDF. Agents can fetch{" "}
        <code className="font-mono text-coral">{base}/fix.md?code=</code>
        <span className="text-cream/50">CODE</span> and{" "}
        <code className="font-mono text-coral">{base}/report.pdf?code=</code>
        <span className="text-cream/50">CODE</span>.
      </p>
    </>
  );
}
