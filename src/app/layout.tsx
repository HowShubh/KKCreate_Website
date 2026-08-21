import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE } from "@/lib/content";
import { getSiteSettings } from "@/lib/settings";
import { SITE_URL } from "@/lib/siteUrl";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Serif used only for italic emphasis accents inside sans-serif headings.
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
  style: ["italic", "normal"],
});

// Editorial faces for the photo-essay pages (titles/body + mono kickers).
const essaySerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE.brand} · ${SITE.motto}`,
    template: `%s · ${SITE.brand}`,
  },
  description: SITE.motto,
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${essaySerif.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider defaultTheme={settings.defaultTheme}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        {/* Vercel Analytics: no-ops off Vercel, so local dev stays quiet. */}
        <Analytics />
      </body>
    </html>
  );
}
