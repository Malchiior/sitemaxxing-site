import Image from "next/image";
import {
  Icon,
  SETUP_TEXT,
  SMS_HREF,
  SiteHeader,
  SiteFooter,
} from "./components/site-chrome";

const features = [
  [
    "9 screens, measured",
    "Your page on nine real screen sizes, from a 360px Android to a 2560px ultrawide. Every issue includes the element and the pixel measurements.",
  ],
  [
    "Google + AI readability",
    "See where your title and description get cut off in Google, and whether ChatGPT, Claude and Perplexity can read your site.",
  ],
  [
    "A fix list for your coding agent",
    "Reply “fix” for a prompt built from the measurements. Paste it into Claude Code, Codex or Cursor.",
  ],
];
export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <section className="launch-hero">
        <Image
          className="scene-image"
          src="/images/launch-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
        />
        <SiteHeader />
        <main id="main" className="hero-content">
          <p className="countdown">
            <span />T - 4 mins
          </p>
          <h1>
            Your website isn’t
            <br />
            launch-ready
          </h1>
          <p className="hero-subtitle">Until you run this 4-minute audit.</p>
          <p className="hero-description">
            Get a real website fix check across mobile, Google, and AI —
            <br className="desktop-break" /> then get a prioritized fix list for
            your coding agent.
          </p>
          <div className="hero-actions">
            <a href="#audit" className="button button-white">
              Run the 4-minute audit <Icon name="arrow" />
            </a>
            <a href="#example" className="button button-outline">
              See an example report
            </a>
          </div>
        </main>
      </section>
      <div className="landing-details">
        <Image
          className="details-scene"
          src="/images/orbital-report.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <section id="audit" className="audit-section content-section">
          <div className="audit-intro">
            <p className="section-coordinate">01 / PRE-FLIGHT</p>
            <p className="eyebrow">Your launch starts here</p>
            <h2>
              Get your website
              <br />
              ready for liftoff.
            </h2>
            <p className="muted">
              Get your own Sitemaxxing number, then text it any website. Your
              report comes back by text with clear next steps.
            </p>
            <div className="launch-sequence">
              <span>Send your site</span>
              <span>Get your report</span>
              <span>Make it better</span>
            </div>
          </div>
          <div className="glass setup-panel">
            <div className="panel-heading">
              <span className="round-icon">
                <Icon name="phone" />
              </span>
              <span>
                MISSION CONTROL <small>Website audit / SMS</small>
              </span>
            </div>
            <p className="eyebrow">Run the audit</p>
            <h3>One text. A stronger website.</h3>
            <p>
              Text this to <a href="sms:+16282463032">+1 (628) 246-3032</a>:
            </p>
            <p className="setup-message">{SETUP_TEXT}</p>
            <a href={SMS_HREF} className="button button-coral">
              Open text message <Icon name="arrow" />
            </a>
            <p className="small muted">
              You’ll get your own Sitemaxxing number back. Text it your site to
              start.
            </p>
          </div>
        </section>
        <section
          className="content-section feature-section"
          aria-label="What you get"
        >
          {features.map(([title, text], i) => (
            <article key={title}>
              <div className="feature-heading">
                <Icon name={i === 0 ? "phone" : i === 1 ? "globe" : "file"} />
                <span className="feature-number">0{i + 1}</span>
              </div>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </section>
        <section id="example" className="content-section example-section">
          <div className="example-intro">
            <p className="section-coordinate">02 / MISSION BRIEFING</p>
            <p className="eyebrow">The mission briefing</p>
            <h2>
              A real report.
              <br />A clear way forward.
            </h2>
            <p className="muted">
              See the public example for sbeoc.com. The full report includes a
              downloadable PDF and a fix list for your coding agent.
            </p>
            <a href="/r/sbeoc.com" className="button button-coral">
              Open report with your code <Icon name="arrow" />
            </a>
          </div>
          <article
            className="report-preview"
            aria-label="Public example report for sbeoc.com"
          >
            <Image
              src="/images/orbital-report-unlocked.webp"
              alt=""
              fill
              sizes="(max-width: 800px) 100vw, 60vw"
            />
            <div className="preview-content">
              <div className="preview-topline">
                <Image
                  src="/brand/sitemaxxing-mascot.png"
                  alt="Sitemaxxing"
                  width={512}
                  height={475}
                />
                <span>EXAMPLE REPORT</span>
              </div>
              <p className="eyebrow">Sitemaxxing fit check</p>
              <h3>Report for sbeoc.com</h3>
              <p className="preview-subtitle">
                Real issues. Clear fixes. A stronger site.
              </p>
              <dl className="preview-scores">
                <div>
                  <dd>75</dd>
                  <dt>Phones</dt>
                </div>
                <div>
                  <dd>75–100</dd>
                  <dt>Tablets</dt>
                </div>
                <div>
                  <dd>100</dd>
                  <dt>Computers</dt>
                </div>
              </dl>
              <div className="preview-findings">
                <div className="preview-bar">
                  <Icon name="file" />
                  <span>PRIORITIZED FIX LIST</span>
                </div>
                <ol>
                  <li>
                    <span>01</span>
                    <div>
                      <strong>Make every image load</strong>
                      <p>Repair the broken logo on phones and tablets.</p>
                    </div>
                  </li>
                  <li>
                    <span>02</span>
                    <div>
                      <strong>Give search engines more to read</strong>
                      <p>Add a clear headline and useful homepage copy.</p>
                    </div>
                  </li>
                  <li>
                    <span>03</span>
                    <div>
                      <strong>Take control of your search result</strong>
                      <p>Add a descriptive meta description.</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div className="preview-bottom">
                <span>9 SCREEN SIZES</span>
                <span>GOOGLE + AI</span>
                <span>PDF + FIX LIST</span>
              </div>
            </div>
          </article>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
