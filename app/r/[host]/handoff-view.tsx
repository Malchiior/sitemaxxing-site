/* eslint-disable @next/next/no-img-element */
import { SiteHeader, SiteFooter } from "@/app/components/site-chrome";
import type { ReportMeta } from "@/lib/reports";
import { CopyBox } from "./copy-box";

export function HandoffView({host, meta, prompt}:{host:string; meta:ReportMeta; prompt:string}) {
  const base = `/r/${encodeURIComponent(host)}/files/`;
  const link = (name:string) => base + name.split('/').map(encodeURIComponent).join('/');
  const files = meta.handoff!.files;
  const mobile = files.filter(f => f.path.startsWith('design/mobile/references/') && f.path.endsWith('.png'));
  const mac = files.filter(f => f.path.startsWith('design/mac/screens/') && f.path.endsWith('.png'));
  const brand = files.filter(f => f.path.startsWith('design/mac/assets/brand/') && f.path.endsWith('.png'));
  const title = (path:string) => path.split('/').pop()!.replace(/\.png$/,'').replace(/--/g,' · ').replace(/-/g,' ');
  const documents = ['START-HERE.md','AGENT-PROMPT.md','IMPLEMENTATION-SCOPE.md','ACCEPTANCE-CHECKLIST.md','sitemaxxing/RUNBOOK.md','sitemaxxing/PROVENANCE.md','reports/README.md','MANIFEST.json'];
  return <div className="handoff-shell"><a className="skip-link" href="#handoff">Skip to handoff</a><SiteHeader report handoff />
    <main id="handoff" className="handoff-main">
      <p className="eyebrow">PLOW · OWNER HANDOFF</p>
      <h1>One package.<br/>The complete Plow redesign.</h1>
      <p className="handoff-lead">Mobile, SMS and the Latch Mac app. All the designs, assets and instructions your coding agent needs to build it.</p>
      <div className="handoff-actions"><a className="button button-coral" href={link('plow-owner-handoff.zip')}>Download full handoff · 47 MB</a><a className="button" href="#agent-prompt">Copy agent prompt ↓</a></div>
      <p className="small muted">Implementation handoff, not a completed Plow audit. The included instructions require the agent to build, test and generate the full standard Sitemaxxing report.</p>
      <nav className="handoff-nav" aria-label="Handoff sections"><a href="#mobile">8 mobile screens</a><a href="#mac">18 Mac screens</a><a href="#brand">New logo</a><a href="#documents">Documents</a><a href="#agent-prompt">Agent instructions</a></nav>
      <section className="glass handoff-steps"><h2>Send it. Build it. Verify it.</h2><ol><li>Give your coding agent this page and access code, plus access to your Plow repositories.</li><li>Have it download and extract the ZIP, then follow AGENT-PROMPT.md.</li><li>It implements the experience, runs the real public-site Sitemaxxing audit, and separately tests signed-in mobile flows and the Mac app.</li></ol><p className="muted">No app source or account credentials are included. The agent must use your real repositories and authorized test environment.</p></section>
      {[["mobile","Mobile + SMS",mobile],["mac","Plow Latch for Mac",mac],["brand","The new Latch identity",brand]].map(([id,label,items]) => <section key={id as string} id={id as string} className="handoff-section"><h2>{label as string}</h2><p className="muted">Open any reference at full size. Reusable assets and implementation details are in the ZIP.</p><div className={`handoff-grid ${id === 'mobile' ? 'mobile-grid' : ''}`}>
        {(items as typeof files).map(f => <a key={f.path} className="handoff-card" href={link(f.path)} target="_blank" rel="noreferrer"><img loading="lazy" src={link(f.path)} alt={title(f.path)} /><span>{title(f.path)}</span></a>)}
      </div></section>)}
      <section id="documents" className="handoff-section"><h2>Everything, organized.</h2><div className="handoff-documents">{documents.map(name=><a key={name} href={link(name)}>{name}<span>Open ↗</span></a>)}</div><p className="muted">The ZIP includes both complete design packs, icon libraries, illustrations, tokens, native component starting points and the pinned MIT Sitemaxxing source. The manifest provides file sizes and SHA-256 checksums.</p></section>
      <section id="agent-prompt" className="handoff-section"><h2>The full instruction for your agent</h2><p className="muted">Copy this after giving the agent the extracted ZIP and repository access.</p><CopyBox text={prompt} label="agent prompt" /></section>
      <details className="agent-details"><summary>Direct access for coding agents</summary><p>Fetch <code>{base}AGENT-PROMPT.md?code=CODE</code> and <code>{base}plow-owner-handoff.zip?code=CODE</code>. Replace CODE with the shared six-digit access code. Keep the code out of source control. Additional files use the same path structure and authorization.</p></details>
    </main><SiteFooter /></div>;
}
