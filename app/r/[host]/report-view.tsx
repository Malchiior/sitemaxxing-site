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
  handoff?: boolean;
  handoffTitle?: string;
};
export function ReportView({
  host,
  open,
  wrong,
  summary,
  fix,
  unlockAction,
  handoff = false,
  handoffTitle,
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
          <p className="eyebrow">{handoff ? "Design + implementation" : "Sitemaxxing fit check"}</p>
          <h1>{handoff ? (handoffTitle ? `Your ${handoffTitle} handoff` : "Your complete Plow handoff") : `Report for ${host}`}</h1>
          <p className="report-subtitle">
            {open
              ? "Real issues. Clear fixes. A faster, stronger site."
              : "Enter your shared 6-digit access code"}
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
                Enter your 6-digit access code
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
                <UnlockButton label={handoff ? "Open handoff" : "Open report"} />
              </div>
              <p id="code-help" className="small muted">
                Use the code shared with this link.
                <br />
                Enter it above to access your {handoff ? "designs, ZIP and agent prompt" : "report"}.
              </p>
              {wrong && (
                <p id="code-error" className="form-error" role="alert">
                  That code didn’t work. Check your text and try again.
                </p>
              )}
              {handoff && <details className="agent-details">
                <summary>Opening this with a coding agent?</summary>
                <p>Use the shared code to fetch <code>{base}/files/AGENT-PROMPT.md?code=CODE</code> and <code>{base}/files/{handoffTitle ? "handoff.zip" : "plow-owner-handoff.zip"}?code=CODE</code>. Replace CODE with the six-digit code, extract the ZIP, then follow AGENT-PROMPT.md with access to the actual project repositories.</p>
              </details>}
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
