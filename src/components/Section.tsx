import { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-8 md:py-12 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  align = "left",
}: {
  kicker?: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {kicker && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-saffron">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-content text-balance md:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg leading-relaxed text-content-soft">{intro}</p>}
    </div>
  );
}
