import Image from "next/image";

export const SETUP_TEXT =
  "Set this up for me: aiworthusing.com/agent-index/sitemaxxing";
export const SMS_HREF = `sms:+16282463032?&body=${encodeURIComponent(SETUP_TEXT)}`;

export function Icon({
  name,
}: {
  name: "arrow" | "phone" | "globe" | "download" | "copy" | "file" | "user";
}) {
  const paths = {
    arrow: <path d="M4 12h15M13 5l7 7-7 7" />,
    phone: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M10 5h4M11 19h2" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="10" />
        <ellipse cx="12" cy="12" rx="4" ry="10" />
        <path d="M2 12h20M4 6.5c5 3 11 3 16 0M4 17.5c5-3 11-3 16 0" />
      </>
    ),
    download: <path d="M12 3v12m-5-5 5 5 5-5M3 15v5h18v-5" />,
    copy: (
      <>
        <rect x="8" y="5" width="12" height="16" rx="2" />
        <path d="M16 5V3H4v15h4" />
      </>
    ),
    file: <path d="M6 2h8l4 4v16H6zM14 2v5h4" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2z" />
      </>
    ),
  };
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export function SiteHeader({ report = false }: { report?: boolean }) {
  return (
    <header className={`site-header ${report ? "report-header" : ""}`}>
      <a className="brand" href="/" aria-label="Sitemaxxing home">
        <Image
          src="/brand/sitemaxxing-mascot.png"
          alt="Sitemaxxing"
          width={512}
          height={475}
          priority
        />
      </a>
      {report ? (
        <nav aria-label="Report navigation" className="report-nav">
          <a className="active" href="#report" aria-current="page">
            Report
          </a>
          <span className="nav-divider" aria-hidden="true" />
          <a
            className="account-link"
            href="/#audit"
            aria-label="Get your own Sitemaxxing number"
          >
            <Icon name="user" />
          </a>
        </nav>
      ) : (
        <a className="button button-outline header-cta" href="#audit">
          Run the audit <Icon name="arrow" />
        </a>
      )}
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a href="/">Sitemaxxing</a>
      <span className="footer-line" />
      <span>Better websites for a brighter tomorrow</span>
      <span className="footer-dash" />
    </footer>
  );
}
export function MissionNote() {
  return (
    <aside className="mission-note" aria-hidden="true">
      Higher
      <br />
      visibility
      <br />a brighter
      <br />
      tomorrow
      <span />
    </aside>
  );
}
