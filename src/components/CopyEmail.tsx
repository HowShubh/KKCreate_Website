"use client";

import { useState } from "react";

// Shows an email as a mailto: link (opens the visitor's mail app) with a copy
// button beside it, so if no mail handler is set they can still grab the
// address. Used in the footer's "Get in touch" list.
export function CopyEmail({
  email,
  tone = "onDark",
}: {
  email: string;
  tone?: "onDark" | "onLight";
}) {
  const [copied, setCopied] = useState(false);
  const linkCls =
    tone === "onLight" ? "text-content" : "text-paper/90";
  const btnCls =
    tone === "onLight" ? "text-content-soft" : "text-paper/45";

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Fallback for older browsers / non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        className={`${linkCls} transition-colors hover:text-saffron`}
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied" : `Copy ${email}`}
        className={`inline-flex items-center gap-1 ${btnCls} transition-colors hover:text-saffron`}
      >
        {copied ? (
          <>
            <CheckIcon />
            <span className="text-xs font-medium text-saffron">Copied!</span>
          </>
        ) : (
          <CopyIcon />
        )}
      </button>
    </span>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="11"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15V5a2 2 0 0 1 2-2h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
