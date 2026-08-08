"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({
  className = "",
  withLabel = false,
}: {
  className?: string;
  /** Full-width icon + text row, for the mobile menu rather than the navbar. */
  withLabel?: boolean;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");
  // Render a stable icon/label until mounted to avoid a hydration mismatch.
  const icon = mounted && isDark ? <SunIcon /> : <MoonIcon />;

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
        className={`flex w-full items-center gap-3 py-3 text-base font-medium text-content-soft transition-colors hover:text-content ${className}`}
      >
        <span className="text-content" suppressHydrationWarning>
          {icon}
        </span>
        <span suppressHydrationWarning>
          {mounted && isDark ? "Light mode" : "Dark mode"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      onClick={toggle}
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-content transition-colors hover:bg-canvas-2 ${className}`}
    >
      <span suppressHydrationWarning>{icon}</span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}
