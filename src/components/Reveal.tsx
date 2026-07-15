"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

// Fades + slides its content up into place the first time it scrolls into view.
// Use `delay` (ms) on siblings to stagger a row/grid of items.
export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        transitionDelay: shown ? `${delay}ms` : "0ms",
        transform: shown ? undefined : `translateY(${y}px)`,
      }}
    >
      {children}
    </Tag>
  );
}
