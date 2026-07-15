"use client";

import { useEffect, useRef, useState } from "react";

// Animates a formatted stat (e.g. "40M+", "1.2M+", "180+", "214") by counting
// the numeric part up from zero the first time it scrolls into view. Any
// leading number (with optional decimals) is animated; the trailing suffix
// like "M+" or "+" is preserved.
export function CountUp({
  value,
  duration = 1600,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const match = value.match(/^([\d,]+(?:\.\d+)?)(.*)$/);
  const decimals = match ? decimalsOf(match[1]) : 0;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(() =>
    match ? format(0, decimals, suffix) : value,
  );

  useEffect(() => {
    if (!match) return;
    const el = ref.current;
    if (!el) return;

    const target = parseFloat(match[1].replace(/,/g, ""));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(format(target, decimals, suffix));
      return;
    }

    let raf = 0;
    let started = false;

    const animate = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        setDisplay(format(target * eased, decimals, suffix));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            animate();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

function decimalsOf(numStr: string) {
  const dot = numStr.indexOf(".");
  return dot === -1 ? 0 : numStr.length - dot - 1;
}

function format(n: number, decimals: number, suffix: string) {
  return (
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) + suffix
  );
}
