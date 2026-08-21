import Script from "next/script";

// Google Analytics + Microsoft Clarity.
//
// Both are public tag ids — they ship in the page source either way, so
// there's nothing to hide in an env var.
const GA_MEASUREMENT_ID = "G-3XTGKHTD6S";
const CLARITY_PROJECT_ID = "y5ph5165y3";

/**
 * Third-party analytics, loaded with `afterInteractive` so the page wins the
 * race: nothing here is fetched or executed until React has hydrated and the
 * page is usable, and neither tag blocks first paint.
 *
 * Only rendered in production builds, so local `npm run dev` traffic never
 * reaches either dashboard. Vercel's own <Analytics /> self-gates the same way.
 */
export function AnalyticsScripts() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>

      <Script id="clarity-init" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");`}
      </Script>
    </>
  );
}
