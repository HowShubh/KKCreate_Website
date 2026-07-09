// Local placeholder content. Replace with CMS-sourced data once the CMS is chosen.
// Shape is kept flat and serializable so a CMS adapter can drop in with minimal changes.

export const SITE = {
  company: "K K Create Pvt. Ltd.",
  brand: "KK Create",
  motto: "Making videos around the social realities of India",
  platforms: [
    { name: "YouTube", icon: "youtube", href: "https://youtube.com/@kk.create" },
    { name: "Instagram", icon: "instagram", href: "https://instagram.com/kk.create" },
    { name: "Facebook", icon: "facebook", href: "https://facebook.com/kk.create" },
    { name: "LinkedIn", icon: "linkedin", href: "https://linkedin.com/company/kk-create" },
  ],
  contacts: {
    brands: "brands@kkcreate.in",
    creators: "creators@kkcreate.in",
    careers: "careers@kkcreate.in",
  },
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Photo-essays", href: "/photo-essays" },
] as const;

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export type CatalogTopic =
  | "AI"
  | "YouTube"
  | "Instagram"
  | "Money"
  | "Writing";
export type CatalogType = "Workshop" | "Course" | "Ebook" | "Tools";

export const CATALOG_TOPICS: ("All" | CatalogTopic)[] = [
  "All",
  "AI",
  "YouTube",
  "Instagram",
  "Money",
  "Writing",
];
export const CATALOG_TYPES: CatalogType[] = [
  "Workshop",
  "Course",
  "Ebook",
  "Tools",
];

// Emoji glyphs for the topic filter pills on the catalog page.
export const CATALOG_TOPIC_EMOJI: Record<"All" | CatalogTopic, string> = {
  All: "✨",
  AI: "🤖",
  YouTube: "▶️",
  Instagram: "📸",
  Money: "💰",
  Writing: "✍️",
};

// Call-to-action label per product type.
export const CATALOG_CTA: Record<CatalogType, string> = {
  Course: "Enroll Now",
  Workshop: "Book Seat",
  Ebook: "Get Ebook",
  Tools: "Get Access",
};

export type CatalogItem = {
  id: string;
  title: string;
  type: CatalogType;
  topic: CatalogTopic;
  thumbnail: string;
  description: string;
  price: string;
  duration: string; // e.g. "1 hr 3 min"
  rating: number; // e.g. 4.8
  enrolled: string; // e.g. "9k+"
  flagship?: boolean; // marks the hero product (special badge + accent)
  newlyLaunched?: boolean; // shows a "Newly launched" ribbon in place of stats
  enrollUrl: string; // → external payment page (out of scope, already built)
  knowMoreUrl: string; // → external landing page (out of scope, already built)
};

export const CATALOG: CatalogItem[] = [
  {
    id: "ai-content-creation",
    title: "AI in Content Creation",
    type: "Course",
    topic: "AI",
    thumbnail:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    description:
      "Build a repeatable AI workflow for scripting, editing and publishing faster.",
    price: "₹4,999",
    duration: "1 hr 3 min",
    rating: 4.8,
    enrolled: "9k+",
    flagship: true,
    enrollUrl: "https://pay.kkcreate.in/ai-content-creation",
    knowMoreUrl: "https://learn.kkcreate.in/ai-content-creation",
  },
  {
    id: "youtube-zero-to-100k",
    title: "YouTube: Zero to 100K",
    type: "Course",
    topic: "YouTube",
    thumbnail:
      "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=800&q=80",
    description:
      "Packaging, retention and publishing systems that took our channel past 100K.",
    price: "₹3,499",
    duration: "2 hr 14 min",
    rating: 4.7,
    enrolled: "7k+",
    newlyLaunched: true,
    enrollUrl: "https://pay.kkcreate.in/youtube-100k",
    knowMoreUrl: "https://learn.kkcreate.in/youtube-100k",
  },
  {
    id: "instagram-growth-workshop",
    title: "Instagram Growth Workshop",
    type: "Workshop",
    topic: "Instagram",
    thumbnail:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
    description:
      "A live two-day workshop on reels, hooks and the 2026 Instagram algorithm.",
    price: "₹1,499",
    duration: "2 days · live",
    rating: 4.9,
    enrolled: "6k+",
    enrollUrl: "https://pay.kkcreate.in/instagram-growth",
    knowMoreUrl: "https://learn.kkcreate.in/instagram-growth",
  },
  {
    id: "creator-money-ebook",
    title: "The Creator Money Playbook",
    type: "Ebook",
    topic: "Money",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    description:
      "How Indian creators price brand deals, manage taxes and diversify income.",
    price: "₹499",
    duration: "48 pages",
    rating: 4.6,
    enrolled: "12k+",
    enrollUrl: "https://pay.kkcreate.in/money-playbook",
    knowMoreUrl: "https://learn.kkcreate.in/money-playbook",
  },
  {
    id: "youtube-shorts-workshop",
    title: "YouTube Shorts Sprint",
    type: "Workshop",
    topic: "YouTube",
    thumbnail:
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80",
    description:
      "A one-day sprint to script and shoot a week of Shorts that actually land.",
    price: "₹999",
    duration: "1 day · live",
    rating: 4.8,
    enrolled: "4k+",
    enrollUrl: "https://pay.kkcreate.in/shorts-sprint",
    knowMoreUrl: "https://learn.kkcreate.in/shorts-sprint",
  },
  {
    id: "reels-toolkit",
    title: "Reels Toolkit & Templates",
    type: "Tools",
    topic: "Instagram",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    description:
      "Plug-and-play hook templates, caption frameworks and a posting calendar.",
    price: "₹799",
    duration: "30+ templates",
    rating: 4.8,
    enrolled: "8k+",
    enrollUrl: "https://pay.kkcreate.in/reels-toolkit",
    knowMoreUrl: "https://learn.kkcreate.in/reels-toolkit",
  },
  {
    id: "ai-thumbnail-tools",
    title: "AI Thumbnail Tools Pack",
    type: "Tools",
    topic: "AI",
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    description:
      "Our internal AI prompts and presets for thumbnails that get the click.",
    price: "₹699",
    duration: "Prompt pack",
    rating: 4.7,
    enrolled: "4k+",
    newlyLaunched: true,
    enrollUrl: "https://pay.kkcreate.in/ai-thumbnails",
    knowMoreUrl: "https://learn.kkcreate.in/ai-thumbnails",
  },
  {
    id: "money-brand-deals-course",
    title: "Landing Brand Deals",
    type: "Course",
    topic: "Money",
    thumbnail:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
    description:
      "Pitch decks, media kits and outreach scripts to close your first paid deal.",
    price: "₹2,499",
    duration: "1 hr 41 min",
    rating: 4.9,
    enrolled: "6k+",
    enrollUrl: "https://pay.kkcreate.in/brand-deals",
    knowMoreUrl: "https://learn.kkcreate.in/brand-deals",
  },
  {
    id: "scriptwriting-masterclass",
    title: "Scriptwriting Masterclass",
    type: "Course",
    topic: "Writing",
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    description:
      "Turn a rough idea into a tight, retention-first script using our story blueprints.",
    price: "₹1,999",
    duration: "1 hr 52 min",
    rating: 4.8,
    enrolled: "5k+",
    enrollUrl: "https://pay.kkcreate.in/scriptwriting",
    knowMoreUrl: "https://learn.kkcreate.in/scriptwriting",
  },
  {
    id: "hook-writing-ebook",
    title: "100 Hooks That Convert",
    type: "Ebook",
    topic: "Writing",
    thumbnail:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    description:
      "A swipe file of 100 opening lines, broken down by why each one stops the scroll.",
    price: "₹399",
    duration: "36 pages",
    rating: 4.7,
    enrolled: "10k+",
    enrollUrl: "https://pay.kkcreate.in/hooks-ebook",
    knowMoreUrl: "https://learn.kkcreate.in/hooks-ebook",
  },
  {
    id: "youtube-thumbnail-course",
    title: "Thumbnails That Get Clicks",
    type: "Course",
    topic: "YouTube",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774625-0b1c2c4a05a1?w=800&q=80",
    description:
      "Composition, contrast and psychology behind thumbnails that lift your CTR.",
    price: "₹1,299",
    duration: "58 min",
    rating: 4.6,
    enrolled: "7k+",
    enrollUrl: "https://pay.kkcreate.in/thumbnails-course",
    knowMoreUrl: "https://learn.kkcreate.in/thumbnails-course",
  },
  {
    id: "ai-editing-workshop",
    title: "AI Video Editing Workshop",
    type: "Workshop",
    topic: "AI",
    thumbnail:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&q=80",
    description:
      "A live session on cutting your edit time in half with AI-assisted workflows.",
    price: "₹1,199",
    duration: "1 day · live",
    rating: 4.8,
    enrolled: "3k+",
    newlyLaunched: true,
    enrollUrl: "https://pay.kkcreate.in/ai-editing",
    knowMoreUrl: "https://learn.kkcreate.in/ai-editing",
  },
  {
    id: "instagram-monetization-course",
    title: "Monetise Your Instagram",
    type: "Course",
    topic: "Money",
    thumbnail:
      "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&q=80",
    description:
      "Every revenue stream on Instagram, from brand deals to your own digital products.",
    price: "₹2,299",
    duration: "1 hr 24 min",
    rating: 4.7,
    enrolled: "5k+",
    enrollUrl: "https://pay.kkcreate.in/insta-monetize",
    knowMoreUrl: "https://learn.kkcreate.in/insta-monetize",
  },
  {
    id: "caption-templates-tools",
    title: "Caption & Carousel Pack",
    type: "Tools",
    topic: "Writing",
    thumbnail:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    description:
      "Fill-in-the-blank caption and carousel templates for a month of posts.",
    price: "₹599",
    duration: "40+ templates",
    rating: 4.6,
    enrolled: "6k+",
    enrollUrl: "https://pay.kkcreate.in/caption-pack",
    knowMoreUrl: "https://learn.kkcreate.in/caption-pack",
  },
  {
    id: "youtube-analytics-ebook",
    title: "Reading Your Analytics",
    type: "Ebook",
    topic: "YouTube",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    description:
      "A plain-English guide to the four metrics that actually decide your growth.",
    price: "₹449",
    duration: "44 pages",
    rating: 4.5,
    enrolled: "8k+",
    enrollUrl: "https://pay.kkcreate.in/analytics-ebook",
    knowMoreUrl: "https://learn.kkcreate.in/analytics-ebook",
  },
  {
    id: "faceless-channel-workshop",
    title: "Build a Faceless Channel",
    type: "Workshop",
    topic: "AI",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    description:
      "A live build of an AI-assisted faceless channel, from niche to first upload.",
    price: "₹1,499",
    duration: "2 days · live",
    rating: 4.8,
    enrolled: "4k+",
    enrollUrl: "https://pay.kkcreate.in/faceless-channel",
    knowMoreUrl: "https://learn.kkcreate.in/faceless-channel",
  },
];

// Flagship course — reused identically on Home & Learn.
export const FLAGSHIP = {
  id: "ai-content-creation",
  title: "AI in Content Creation",
  kicker: "Flagship Course",
  pointers: [
    "Build an end-to-end AI workflow from idea to published video",
    "Use AI for scripting, editing, thumbnails and repurposing",
    "Ship 4x faster without losing your voice",
  ],
  price: "₹4,999",
  thumbnail:
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
  enrollUrl: "https://pay.kkcreate.in/ai-content-creation",
  knowMoreUrl: "https://learn.kkcreate.in/ai-content-creation",
};

// ---------------------------------------------------------------------------
// Home — What We Do + Metrics + Vibe
// ---------------------------------------------------------------------------

export type WhatWeDoItem = {
  title: string;
  description: string;
  image: string;
  featured?: boolean;
};

export const WHAT_WE_DO: WhatWeDoItem[] = [
  {
    title: "On-Ground Videos",
    description:
      "We travel across India to document the social realities most feeds scroll past.",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&q=80",
    featured: true,
  },
  {
    title: "Podcast",
    description:
      "Long-form conversations with the people living the stories we tell.",
    image:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1000&q=80",
  },
  {
    title: "Short-form",
    description:
      "Reels and Shorts that turn complex realities into a 60-second watch.",
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1000&q=80",
  },
  {
    title: "Courses & Workshops",
    description:
      "We teach creators the systems we use to research, shoot and grow.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&q=80",
  },
  {
    title: "Explainers",
    description:
      "In-studio videos where we break down complex topics through animations and expert interviews — made from our home, built for curious minds.",
    image:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&q=80",
  },
];

// Home "growth" band — one featured stat on the left, a list on the right.
export const GROWTH = {
  kicker: "Every single month",
  feature: {
    value: "40M",
    plus: "+",
    caption: {
      prefix: "people reached — more than the population of ",
      emphasis: "Canada",
      suffix: ".",
    },
  },
  stats: [
    { label: "Avg. views / video", value: "1.2M+" },
    { label: "Stories published", value: "180+" },
    { label: "Districts covered", value: "214" },
  ],
} as const;

// Brands we've worked with — auto-scrolling marquee on the home page.
// `logo` is optional: if omitted the brand name is shown as a wordmark chip.
// Swap `thumbnail` for the real video still and `videoUrl` for the post link.
export type BrandWork = {
  brand: string;
  logo: string;
};

// Demo brand set — swap `logo`/`brand` for real client assets when available.
// White monochrome marks so they sit uniformly on the dark logo cards.
export const BRAND_WORK: BrandWork[] = [
  { brand: "Zomato", logo: "https://cdn.simpleicons.org/zomato/ffffff" },
  { brand: "Swiggy", logo: "https://cdn.simpleicons.org/swiggy/ffffff" },
  { brand: "Razorpay", logo: "https://cdn.simpleicons.org/razorpay/ffffff" },
  { brand: "Paytm", logo: "https://cdn.simpleicons.org/paytm/ffffff" },
  { brand: "PhonePe", logo: "https://cdn.simpleicons.org/phonepe/ffffff" },
  { brand: "Zerodha", logo: "https://cdn.simpleicons.org/zerodha/ffffff" },
  { brand: "Unacademy", logo: "https://cdn.simpleicons.org/unacademy/ffffff" },
  { brand: "OYO", logo: "https://cdn.simpleicons.org/oyo/ffffff" },
];

// Each frame cycles through its `srcs` on a loop (see VibeGrid).
const VIBE_IMG = {
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
  founders:
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
  editBay:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
  location:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
  huddle:
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80",
  desk: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80",
  whiteboard:
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&q=80",
} as const;

export const VIBE = [
  {
    srcs: [VIBE_IMG.team, VIBE_IMG.huddle, VIBE_IMG.editBay],
    caption: "The whole team between shoots",
    span: "tall",
  },
  {
    srcs: [VIBE_IMG.founders, VIBE_IMG.desk, VIBE_IMG.location],
    caption: "Founders mapping the next series",
    span: "wide",
  },
  {
    srcs: [VIBE_IMG.editBay, VIBE_IMG.whiteboard, VIBE_IMG.team],
    caption: "Edit bay, 2am energy",
    span: "normal",
  },
  {
    srcs: [VIBE_IMG.location, VIBE_IMG.team, VIBE_IMG.huddle],
    caption: "On location in Rajasthan",
    span: "normal",
  },
  {
    srcs: [VIBE_IMG.huddle, VIBE_IMG.founders, VIBE_IMG.whiteboard],
    caption: "Research huddle",
    span: "wide",
  },
] as const;

// ---------------------------------------------------------------------------
// Learn — Social Proof, Video Testimonials, FAQ
// ---------------------------------------------------------------------------

export const SOCIAL_PROOF = {
  students: {
    label: "Our Students",
    value: "12,000+",
    sub: "creators trained",
    image:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
  },
  performance: {
    label: "Our Performance",
    value: "4.8/5",
    sub: "avg. course rating",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
  },
  featuredIn: [
    "YourStory",
    "The Ken",
    "Inc42",
    "Social Samosa",
    "afaqs!",
  ],
};

export const TEXT_TESTIMONIALS = [
  {
    quote:
      "I went from 2K to 50K followers in four months using the Instagram workshop frameworks.",
    name: "Ananya R.",
    role: "Lifestyle creator",
  },
  {
    quote:
      "The AI course paid for itself in a week. My editing time literally halved.",
    name: "Vikram S.",
    role: "Tech YouTuber",
  },
  {
    quote:
      "Landing Brand Deals gave me the exact pitch that closed my first ₹1L deal.",
    name: "Meera J.",
    role: "Travel creator",
  },
];

export type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  youtubeId: string;
  thumbnail: string; // portrait still for the play card
};

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "v1",
    name: "Rohit & Sana",
    role: "Food channel",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
  },
  {
    id: "v2",
    name: "Priya K.",
    role: "Finance creator",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
  },
  {
    id: "v3",
    name: "Aman T.",
    role: "Gaming creator",
    youtubeId: "dQw4w9WgXcQ",
    thumbnail:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80",
  },
];

// Large highlighted testimonial for the showcase block.
export const FEATURED_TESTIMONIAL = {
  stat: "1.2M Impressions",
  quote:
    "The course modules guided me through the exact strategies and packaging that revealed how much scope there really is on Instagram.",
  name: "Kushagra T.",
  role: "Enrolled in Instagram Growth Workshop",
  image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
};

export const FAQ = [
  {
    q: "Do I get lifetime access to courses?",
    a: "Yes. Every course and ebook purchase includes lifetime access plus all future updates to that product.",
  },
  {
    q: "Are the workshops live or recorded?",
    a: "Workshops are run live on scheduled dates. If you can't attend, registered participants get the full recording within 48 hours.",
  },
  {
    q: "What language is the content in?",
    a: "Most content is taught in Hindi with English on-screen text and downloadable English resources.",
  },
  {
    q: "Do you offer refunds?",
    a: "Courses and ebooks come with a 7-day refund window if you've completed less than 20% of the material. Workshop seats are non-refundable once the session has started.",
  },
  {
    q: "I'm a complete beginner. Is this for me?",
    a: "Absolutely. Each product lists its level on the landing page, and our flagship and workshops are designed to take you from zero.",
  },
];

// ---------------------------------------------------------------------------
// Photo-essays
// ---------------------------------------------------------------------------

export type EssayBlock =
  | { kind: "text"; size: "lead" | "body"; content: string }
  | { kind: "image"; src: string; alt: string; size: "full" | "wide" | "inset"; caption?: string }
  | { kind: "youtube"; youtubeId: string; caption?: string };

export type PhotoEssay = {
  slug: string;
  title: string;
  logline: string;
  description: string;
  cover: string;
  location: string;
  date: string;
  readMinutes: number;
  blocks: EssayBlock[];
};

export const PHOTO_ESSAYS: PhotoEssay[] = [
  {
    slug: "the-last-letter-writers",
    title: "The Last Letter Writers",
    logline: "Outside a Mumbai post office, a dying profession holds on.",
    description:
      "For decades, professional letter writers turned spoken words into formal Hindi and Urdu. We spent a week with the few who remain.",
    cover:
      "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=1600&q=80",
    location: "Mumbai, Maharashtra",
    date: "2026-03-12",
    readMinutes: 8,
    blocks: [
      {
        kind: "text",
        size: "lead",
        content:
          "Every morning, Ramesh sets up a folding table outside the GPO. For ₹20, he will turn your words into a letter the government will take seriously.",
      },
      {
        kind: "image",
        src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&q=80",
        alt: "A letter writer at his desk",
        size: "full",
        caption: "Ramesh has written letters here for 34 years.",
      },
      {
        kind: "text",
        size: "body",
        content:
          "When he started, there were more than forty writers on this street. Today there are three. Smartphones did in a decade what nothing else could.",
      },
      {
        kind: "image",
        src: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=900&q=80",
        alt: "Close up of hands writing",
        size: "inset",
        caption: "A pension form, filled by hand.",
      },
      {
        kind: "youtube",
        youtubeId: "dQw4w9WgXcQ",
        caption: "Watch: a morning with the letter writers.",
      },
      {
        kind: "text",
        size: "body",
        content:
          "Most of his customers now are elderly, or migrants who never learned to write formal Hindi. For them, Ramesh is not nostalgia. He is access.",
      },
    ],
  },
  {
    slug: "monsoon-fishermen-of-kerala",
    title: "Monsoon Fishermen of Kerala",
    logline: "When the sea turns violent, a coastal community bets its season.",
    description:
      "The monsoon is both the most dangerous and most lucrative time to fish off the Malabar coast. We followed one crew through a single, brutal week.",
    cover:
      "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1600&q=80",
    location: "Kozhikode, Kerala",
    date: "2026-02-02",
    readMinutes: 10,
    blocks: [
      {
        kind: "text",
        size: "lead",
        content:
          "At 3am the beach is already awake. The forecast says the swell will hit four metres by noon. The crew decides to go anyway.",
      },
      {
        kind: "image",
        src: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=1600&q=80",
        alt: "Fishing boats at dawn",
        size: "full",
      },
      {
        kind: "text",
        size: "body",
        content:
          "A good monsoon haul can be worth three ordinary months. A bad day can cost a boat, or a life. Everyone here knows someone the sea has taken.",
      },
      {
        kind: "image",
        src: "https://images.unsplash.com/photo-1542880430-fcaeb79f54f1?w=900&q=80",
        alt: "Fisherman mending a net",
        size: "inset",
        caption: "Nets are mended between every trip.",
      },
    ],
  },
  {
    slug: "the-night-school-teachers",
    title: "The Night-School Teachers",
    logline: "After their day jobs, they teach the children the system forgot.",
    description:
      "In a Delhi resettlement colony, volunteers run a school that opens when the sun goes down — for kids who work during the day.",
    cover:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1600&q=80",
    location: "Delhi",
    date: "2026-01-18",
    readMinutes: 7,
    blocks: [
      {
        kind: "text",
        size: "lead",
        content:
          "The classroom is a single rented room with one tubelight. By 7pm it holds thirty children who spent the day sorting scrap or minding siblings.",
      },
      {
        kind: "image",
        src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1600&q=80",
        alt: "A night classroom",
        size: "full",
      },
      {
        kind: "text",
        size: "body",
        content:
          "The teachers are engineers, nurses, shopkeepers. None are paid. The only requirement, they say, is that you show up every single night.",
      },
    ],
  },
];

export const IMPACT = {
  intro:
    "The point was never the views. It is what happens after a story goes out.",
  stats: [
    { value: "₹2.4Cr", label: "raised for people in our stories" },
    { value: "11", label: "policy conversations sparked" },
    { value: "60+", label: "creators who joined the cause" },
    { value: "180+", label: "communities documented" },
  ],
  timeline: [
    {
      year: "2022",
      title: "The first on-ground series",
      text: "A three-part film on sanitation workers crossed 5M views and funded safety gear for two crews.",
    },
    {
      year: "2023",
      title: "From views to action",
      text: "Our flood-relief essay routed direct donations to families in Assam within 72 hours of publishing.",
    },
    {
      year: "2024",
      title: "Reaching the room",
      text: "A photo-essay on gig-worker conditions was cited in a state labour committee hearing.",
    },
    {
      year: "2025",
      title: "Teaching the next wave",
      text: "We began training creators so more of India's realities get documented, not fewer.",
    },
  ],
};
