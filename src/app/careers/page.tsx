import type { Metadata } from "next";
import { getJobOpenings, type JobOpening } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at KK Create. Join our amazing team.",
};

// Kept deliberately plain: a title, how many roles are open, and the list.
// Each row is the role, where it is and (optionally) one line on what it is
// — the form does the rest.
export default async function CareersPage() {
  const openings = await getJobOpenings();
  const count = openings.length;

  // .container-page carries its own max-width, so the narrow column is an
  // inner wrapper — a job list reads better at reading width than full bleed.
  return (
    <section>
      <div className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-[1.06] tracking-tight text-content text-balance md:text-5xl">
            Join our{" "}
            <span className="font-serif font-normal italic text-saffron">
              amazing team.
            </span>
          </h1>
          <p className="mt-3 text-base font-medium text-content-soft">
            {count === 0
              ? "No open roles right now"
              : `${count} open role${count === 1 ? "" : "s"}`}
          </p>

          {count > 0 ? (
            <ul className="mt-8 divide-y divide-hairline overflow-hidden rounded-2xl border border-hairline bg-card shadow-sm">
              {openings.map((role) => (
                <li key={role.id}>
                  <RoleRow role={role} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 rounded-2xl border border-dashed border-content/20 px-6 py-12 text-center text-content-soft">
              Check back soon — new roles show up here as they open.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* The whole row is the link, opening the form in a new tab so the applicant
   still has the list to come back to. "Apply now" is a span, not a nested
   button — one link per row, and the pill is just where it looks clickable.

   Two layouts share one row: on a phone the pill sits at the end of the
   location line, so every row closes on the same compact meta/CTA line and a
   long title keeps the full width; from `sm` up the pill moves out to the
   right edge and centres on the text block. */
function RoleRow({ role }: { role: JobOpening }) {
  return (
    <a
      href={role.applyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-5 px-5 py-4 transition-colors hover:bg-content/5 sm:px-6 sm:py-5"
    >
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-[17px] font-semibold leading-snug text-content transition-colors group-hover:text-saffron sm:text-lg">
          {role.title}
        </h2>
        {role.description && (
          <p className="mt-1 text-[15px] leading-relaxed text-content-soft">
            {role.description}
          </p>
        )}
        <div className="mt-2.5 flex items-center justify-between gap-4 sm:mt-2">
          {role.location ? (
            <p className="flex items-center gap-1.5 text-sm text-content-soft">
              <PinIcon />
              {role.location}
            </p>
          ) : (
            <span />
          )}
          <ApplyPill className="inline-flex sm:hidden" />
        </div>
      </div>
      <ApplyPill className="hidden sm:inline-flex" />
    </a>
  );
}

// The caller sets the display class (which breakpoint this copy shows at) —
// keeping it out of the base list so `hidden` can actually win.
function ApplyPill({ className }: { className: string }) {
  return (
    <span
      className={`shrink-0 items-center rounded-full bg-saffron px-3.5 py-1.5 text-[13px] font-semibold text-paper transition-colors group-hover:bg-saffron-dark sm:px-4 sm:py-2 sm:text-sm ${className}`}
    >
      Apply now
    </span>
  );
}

function PinIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 opacity-70"
    >
      <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}
