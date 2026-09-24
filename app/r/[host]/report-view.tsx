import Image from "next/image";
import {
  Icon,
  MissionNote,
  SiteFooter,
  SiteHeader,
} from "@/app/components/site-chrome";
import { CopyBox } from "./copy-box";
import { UnlockButton } from "./unlock-button";

type Props = {
  host: string;
  open: boolean;
  wrong?: boolean;
  summary: string;
  fix: string;
  unlockAction: (data: FormData) => void | Promise<void>;
};
export function ReportView({
  host,
  open,
  wrong,
  summary,
  fix,
  unlockAction,
}: Props) {
  const base = `/r/${encodeURIComponent(host)}`;
  const counts = summary.match(
    /fixed\s+(\d+),\s*still there\s+(\d+),\s*new\s+(\d+)/i,
  );
  return (
    <div className={`report-shell ${open ? "is-unlocked" : "is-locked"}`}>
      <Image
        className="scene-image report-scene"
        src={
          open
            ? "/images/orbital-report-unlocked.webp"
            : "/images/orbital-report.webp"
        }
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <a href="#report" className="skip-link">
        Skip to report
      </a>
      <SiteHeader report />
      <main id="report" className="report-main">
        <div className="report-title">
          <p className="eyebrow">Sitemaxxing fit check</p>
          <h1>Report for {host}</h1>
          <p className="report-subtitle">
            {open
              ? "Real issues. Clear fixes. A faster, stronger site."
              : "Enter the 6-digit code from your text"}
          </p>
        </div>
        <MissionNote />
        {!open ? (
          <form action={unlockAction} className="glass unlock-panel">
            <input type="hidden" name="host" value={host} />
            <span className="round-icon">
              <Icon name="phone" />
            </span>
            <div className="unlock-fields">
              <label htmlFor="code">
                Enter the 6-digit code from your text
              </label>
              <div className="unlock-controls">
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoComplete="one-time-code"
                  placeholder="1 2 3 4 5 6"
                  required
                  aria-describedby={
                    wrong ? "code-help code-error" : "code-help"
                  }
                  aria-invalid={wrong || undefined}
                />
                <UnlockButton />
              </div>
              <p id="code-help" className="small muted">
                We sent a 6-digit code to your phone via text message.
                <br />
                Enter the code above to access your report.
              </p>
              {wrong && (
                <p id="code-error" className="form-error" role="alert">
                  That code didn’t work. Check your text and try again.
                </p>
              )}
            </div>
          </form>
        ) : (
          <>
            <section
              className="glass report-summary"
              aria-label="Report summary"
            >
              <span className="round-icon">
                <Icon name="globe" />
              </span>
              <p className="summary-text">{summary}</p>
              {counts && (
                <dl className="report-counts">
                  {["Fixed", "Still there", "New"].map((label, i) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{counts[i + 1]}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
            <a
              href={`${base}/report.pdf`}
              className="button button-coral download-button"
            >
              <Icon name="download" />
              Download PDF
            </a>
            <section className="fix-section" aria-labelledby="fix-title">
              <h2 id="fix-title">Fix list</h2>
              <p className="muted">
                Actionable fixes to help your site perform better in search.
              </p>
              <CopyBox text={fix} />
            </section>
            <details className="agent-details">
              <summary>Use this report with your coding agent</summary>
              <p>
                Give your coding agent this link and code, or the PDF. Agents
                can fetch <code>{base}/fix.md?code=CODE</code> and{" "}
                <code>{base}/report.pdf?code=CODE</code>.
              </p>
            </details>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
