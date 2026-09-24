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
        <section id="audit" className="audit-section content-section">
          <div>
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
          </div>
          <div className="glass setup-panel">
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
              <span className="feature-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </section>
        <section id="example" className="content-section example-section">
          <div>
            <p className="eyebrow">The mission briefing</p>
            <h2>
              A real report.
              <br />A clear way forward.
            </h2>
            <p className="muted">
              See the public example for sbeoc.com. The full report includes a
              downloadable PDF and a fix list for your coding agent.
            </p>
            <a href="/r/sbeoc.com" className="button button-outline">
              Open report with your code <Icon name="arrow" />
            </a>
          </div>
          <div className="example-images">
            <Image
              src="/example-card.png"
              alt="Example sbeoc.com audit: screen-size scores, website issues, Google preview and AI access"
              width={1080}
              height={1350}
            />
            <Image
              src="/example-pages-card.png"
              alt="Example audit of additional pages, with scores and issues for each page"
              width={1080}
              height={1350}
            />
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}
