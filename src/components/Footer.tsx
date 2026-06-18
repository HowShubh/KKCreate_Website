import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SocialIcon } from "@/components/SocialIcon";
import { SITE, NAV_LINKS } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-24 overflow-hidden rounded-t-[2.5rem] bg-feature text-paper">
      <div className="container-page grid gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="[&_span:last-child]:text-paper" />
          <p className="mt-4 max-w-xs font-display text-lg leading-snug text-paper/80">
            {SITE.motto}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SITE.platforms.map((p) => (
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
              <a
                href={`mailto:${SITE.contacts.brands}`}
                className="text-paper/90 transition-colors hover:text-saffron"
              >
                {SITE.contacts.brands}
              </a>
            </li>
            <li>
              <span className="block text-sm text-paper/50">Creators</span>
              <a
                href={`mailto:${SITE.contacts.creators}`}
                className="text-paper/90 transition-colors hover:text-saffron"
              >
                {SITE.contacts.creators}
              </a>
            </li>
            <li>
              <span className="block text-sm text-paper/50">Careers</span>
              <a
                href={`mailto:${SITE.contacts.careers}`}
                className="text-paper/90 transition-colors hover:text-saffron"
              >
                {SITE.contacts.careers}
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
    </footer>
  );
}
