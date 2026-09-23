import Image from "next/image";

const NUMBER_DISPLAY = "+1 (628) 246-3032";
const NUMBER_TEL = "+16282463032";
const SETUP_TEXT = "Set this up for me: aiworthusing.com/agent-index/sitemaxxing";
const SMS_HREF = `sms:${NUMBER_TEL}?&body=${encodeURIComponent(SETUP_TEXT)}`;

const whatYouGet = [
  {
    title: "9 screens, measured",
    body:
      "Your page on nine real screen sizes, from a 360px Android to a 2560px ultrawide. Every issue is a measurement with the element and the pixel numbers, not a guess.",
  },
  {
    title: "Google + AI readability",
    body:
      "A drawn-to-scale Google result preview showing where your title and description get cut off, and whether ChatGPT, Claude and Perplexity can read your site.",
  },
  {
    title: "A fix list for your coding agent",
    body:
      "Reply “fix” and it sends a prompt built from the measurements. Paste it into Claude Code, Codex or Cursor as is.",
  },
];

const commands = [
  { text: "https://yoursite.com", does: "The full check of the homepage: 9 screens, Google, AI. About a minute." },
  { text: "pages", does: "Up to four more pages from the site’s menu, on the same 9 screens." },
  { text: "the same URL again", does: "Re-check after a deploy: fixed, still there, new." },
  { text: "fix", does: "The fix prompt for your coding agent, as text and as a file." },
  { text: "status", does: "The last check’s results." },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Hero */}
      <section>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          Sitemaxxing
        </h1>
        <p className="mt-4 text-xl leading-snug text-cream/90 sm:text-2xl">
          Mog your competition with a fit check from our sitemaxxing AI agent.
        </p>
        <p className="mt-4 max-w-xl text-base text-cream/70 sm:text-lg">
          Text it your website address. In about a minute it texts back a PDF
          fit check: your page on 9 screen sizes, what&rsquo;s broken measured
          not guessed, a Google result preview, whether ChatGPT, Claude and
          Perplexity can read you, and a fix list for your coding agent.
        </p>

        <div className="mt-8 rounded-xl border border-coral/40 bg-white/5 p-5 sm:p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-coral">
            Get your own Sitemaxxing number
          </p>
          <p className="mt-2 text-cream/80">
            Text this to{" "}
            <a href={`sms:${NUMBER_TEL}`} className="font-semibold text-cream underline decoration-coral underline-offset-4">
              {NUMBER_DISPLAY}
            </a>
            :
          </p>
          <p className="mt-3 break-words rounded-lg bg-navy px-4 py-3 font-mono text-sm text-cream sm:text-base">
            {SETUP_TEXT}
          </p>
          <p className="mt-3 text-sm text-cream/70">
            You get your own Sitemaxxing number back. Text it any site.
          </p>
          <a
            href={SMS_HREF}
            className="mt-4 inline-block rounded-lg bg-coral px-5 py-3 font-semibold text-navy"
          >
            Text {NUMBER_DISPLAY}
          </a>
        </div>
      </section>

      {/* Example card */}
      <section className="mt-16">
        <Image
          src="/example-card.png"
          alt="Sitemaxxing report card for sbeoc.com: the page on a laptop, tablet and phone, scores for phones, tablets and computers, top problems, Google result preview and AI crawler access"
          width={1080}
          height={1350}
          priority
          className="w-full rounded-xl border border-white/10"
        />
        <p className="mt-3 text-sm text-cream/60">
          The report card for sbeoc.com. Reply &ldquo;pages&rdquo; and you get one
          row per page:
        </p>
        <Image
          src="/example-pages-card.png"
          alt="Sitemaxxing pages card: one row per page checked, each with scores and top problems"
          width={1080}
          height={1350}
          className="mt-3 w-full rounded-xl border border-white/10"
        />
      </section>

      {/* What you get */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold sm:text-3xl">What you get</h2>
        <ul className="mt-6 space-y-5">
          {whatYouGet.map((item) => (
            <li key={item.title} className="border-l-2 border-coral pl-4">
              <p className="font-semibold">{item.title}</p>
              <p className="mt-1 text-cream/70">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* What you can text */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold sm:text-3xl">What you can text</h2>
        <ul className="mt-6 divide-y divide-white/10">
          {commands.map((c) => (
            <li key={c.text} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
              <code className="shrink-0 font-mono text-coral sm:w-56">{c.text}</code>
              <span className="text-cream/70">{c.does}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 pt-6 text-sm text-cream/60">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="https://github.com/Malchiior/sitemaxxing" className="underline underline-offset-4 hover:text-cream">
            GitHub
          </a>
          <a href="https://aiworthusing.com/agent-index/sitemaxxing" className="underline underline-offset-4 hover:text-cream">
            Agent Index
          </a>
        </div>
        <p className="mt-4">
          Free, MIT, built for the AI Worth Using x OpenClaw 2.0 hackathon. Runs on Plow.
        </p>
      </footer>
    </main>
  );
}
