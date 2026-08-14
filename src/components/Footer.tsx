import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SocialIcon } from "@/components/SocialIcon";
import { CopyEmail } from "@/components/CopyEmail";
import { SITE, NAV_LINKS } from "@/lib/content";
import { careersLink, getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const { platforms, contacts } = await getSiteSettings();
  const careers = careersLink(contacts);
  return (
    <footer className="mt-24 overflow-hidden rounded-t-[2.5rem] bg-feature text-paper">
      <div className="container-page grid gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo onDark />
          <p className="mt-4 max-w-xs font-display text-lg leading-snug text-paper/80">
            {SITE.motto}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/25 text-paper/80 transition-colors hover:border-saffron hover:text-saffron"
              >
                <SocialIcon name={p.icon} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/50">
            Explore
          </h3>
          <ul className="mt-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-paper/80 transition-colors hover:text-saffron"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-paper/50">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3">
            <li>
              <span className="block text-sm text-paper/50">Brands</span>
              <CopyEmail email={contacts.brands} />
            </li>
            <li>
              <span className="block text-sm text-paper/50">Creators</span>
              <CopyEmail email={contacts.creators} />
            </li>
            {/* Brands and Creators hand over an address to copy; Careers is a
                link out, so it carries the same CTA as its contact card. */}
            <li>
              <span className="block text-sm text-paper/50">Careers</span>
              <a
                href={careers.href}
                {...(careers.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="font-medium text-paper transition-colors hover:text-saffron"
              >
                {careers.label} <span aria-hidden>→</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.company}. All rights reserved.</p>
          <p>Made in India.</p>
        </div>
      </div>

      {/* Oversized wordmark fading into the footer */}
      <div className="relative overflow-hidden">
        <p
          aria-hidden
          className="select-none whitespace-nowrap text-center font-display text-[22vw] font-extrabold leading-[0.8] tracking-tighter text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(250,246,240,0.22), rgba(250,246,240,0.01))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          KKCreate
        </p>
      </div>
    </footer>
  );
}
