"use client";
import { useRef, useState } from "react";
import { Icon } from "@/app/components/site-chrome";
export function CopyBox({ text }: { text: string }) {
  const [status, setStatus] = useState("");
  const content = useRef<HTMLPreElement>(null);
  const itemCount = (text.match(/^\s*\d+\.\s+/gm) ?? []).length;
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard");
    } catch {
      if (content.current) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(content.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
        content.current.focus();
      }
      setStatus("Text selected. Press Ctrl+C or ⌘C to copy.");
    }
  }
  return (
    <div className="copy-box">
      <div className="copy-actions">
        <button
          type="button"
          onClick={copy}
          disabled={!text}
          className="button copy-button"
        >
          <Icon name="copy" />
          {status === "Copied to clipboard" ? "Copied!" : "Copy fix list"}
        </button>
        <span role="status" className="small muted">
          {status}
        </span>
      </div>
      <div className="code-window">
        <div className="code-toolbar">
          <span>
            <Icon name="file" />
            Sitemaxxing fix list
          </span>
          {itemCount > 0 && <span>{itemCount} items</span>}
        </div>
        <div className="code-scroll">
          <pre ref={content} tabIndex={0} aria-label="Fix list content">
            {(text || "Your fix list isn’t available yet. Try again shortly.")
              .split("\n")
              .map((line, i) => (
                <span className="code-line" key={i}>
                  <span className="line-number" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className="line-content">
                    {line}
                    {"\n"}
                  </span>
                </span>
              ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
