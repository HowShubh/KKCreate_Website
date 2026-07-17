// Class strings shared by the public essay renderer ([slug]/page.tsx) and the
// /write editor, so what writers type in looks exactly like what readers see.
export const ESSAY_STYLES = {
  title:
    "font-essay text-4xl font-semibold leading-[1.05] tracking-[-0.01em] text-content text-balance md:text-[58px]",
  dek: "font-essay text-xl italic leading-[1.4] text-content-soft md:text-2xl",
  paragraph:
    "mx-auto mt-7 max-w-[680px] px-5 font-essay text-lg leading-[1.65] text-content-soft first:mt-0 md:px-8 md:text-[21px]",
  pullQuoteWrap: "mx-auto my-14 max-w-[760px] px-5 md:my-[72px] md:px-8",
  pullQuoteText:
    "border-l-[3px] border-saffron pl-6 font-essay text-2xl font-medium italic leading-[1.3] text-content text-balance md:pl-8 md:text-[34px]",
  caption: "font-essay text-[15px] italic text-content-soft/80",
  dropCap:
    "float-left mr-3 mt-1.5 font-essay text-[56px] font-semibold leading-[0.8] text-saffron md:text-[64px]",
  link: "text-saffron underline underline-offset-4 hover:text-saffron-dark",
  kicker: "font-mono text-xs uppercase tracking-[0.14em] text-saffron",
} as const;
