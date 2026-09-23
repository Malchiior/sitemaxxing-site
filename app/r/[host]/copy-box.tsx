"use client";

import { useState } from "react";

export function CopyBox({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked; the textarea below is still selectable
    }
  }
  return (
    <div className="mt-4">
      <button type="button" onClick={copy} className="rounded-lg border border-coral px-4 py-2 text-sm font-semibold text-coral">
        {copied ? "Copied" : "Copy fix list"}
      </button>
      <textarea
        readOnly
        value={text}
        rows={18}
        className="mt-3 w-full rounded-xl border border-white/10 bg-navy p-4 font-mono text-sm text-cream/90"
      />
    </div>
  );
}
