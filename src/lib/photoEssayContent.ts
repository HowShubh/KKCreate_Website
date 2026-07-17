// Static fallback photo-essays, shown until photoEssay documents exist in
// Sanity. Shapes mirror the normalized types in src/lib/photoEssays.ts.
// Images use `label` placeholders (textured blocks, like the design mockups);
// real photographs come from the CMS.

import type {
  EssayAuthor,
  EssayBodyBlock,
  EssayImage,
  PhotoEssay,
} from "./photoEssays";

// --- tiny portable-text authoring helpers -----------------------------------

let k = 0;
const key = () => `static-${k++}`;

type Span = { _type: "span"; _key: string; text: string; marks: string[] };

const span = (text: string, marks: string[] = []): Span => ({
  _type: "span",
  _key: key(),
  text,
  marks,
});

const em = (text: string) => span(text, ["em"]);

const p = (...children: (string | Span)[]): EssayBodyBlock => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: children.map((c) => (typeof c === "string" ? span(c) : c)),
});

const img = (label: string, alt: string, caption?: string): EssayImage => ({
  label,
  alt,
  caption,
});

// --- authors -----------------------------------------------------------------

const KAVYA: EssayAuthor = {
  id: "author.kavya-karnatac",
  name: "Kavya Karnatac",
  bio: "Films and writes about the social realities of India. Watch the companion video on our channel.",
  videoUrl: "https://www.youtube.com/@kk.create",
};

const ROHIT: EssayAuthor = {
  id: "author.rohit-sen",
  name: "Rohit Sen",
  bio: "Documents Mumbai's working neighbourhoods for KK Create.",
  videoUrl: "https://www.youtube.com/@kk.create",
};

const MEHER: EssayAuthor = {
  id: "author.meher-fatima",
  name: "Meher Fatima",
  bio: "Writes about Kashmir's living heritage for KK Create.",
  videoUrl: "https://www.youtube.com/@kk.create",
};

export const STATIC_AUTHORS = [KAVYA, ROHIT, MEHER];

// --- essays (newest first) ---------------------------------------------------

export const STATIC_PHOTO_ESSAYS: PhotoEssay[] = [
  {
    slug: "the-root-bridges-are-still-growing",
    title: "The Root Bridges Are Still Growing",
    dek: "A Khasi village has been training ficus roots across rivers for two hundred years. The bridges outlive their builders.",
    excerpt:
      "A Khasi village has been training ficus roots across rivers for two hundred years. The bridges outlive their builders — and they're still getting stronger.",
    location: "Mawlynnong, Meghalaya",
    publishedAt: "2026-07-04",
    author: KAVYA,
    cover: img(
      "root bridge over river",
      "The double-decker living root bridge at Nongriat in morning mist",
      "The double-decker bridge at Nongriat, photographed at 6 a.m. before the day's first crossings.",
    ),
    tags: ["Meghalaya", "Living infrastructure", "Khasi Hills"],
    videoUrl: "https://www.youtube.com/@kk.create",
    readMinutes: 12,
    photoCount: 34,
    body: [
      p(
        "The first thing you learn in Nongriat is that nobody here says they “built” the bridges. The verb is always ",
        em("grown"),
        ". A bridge is planted the way a promise is made — by someone who knows they will not live to see it kept.",
      ),
      p(
        "Wangkhar, seventy-one, walked us to the oldest crossing his grandfather tended. The ficus roots, trained across the river on hollowed betel trunks, are now thicker than his waist. “Every flood makes it stronger,” he says. Concrete cracks. This tightens.",
      ),
      {
        _type: "imagePair",
        _key: key(),
        left: img(
          "portrait — Wangkhar's hands on root rail",
          "Wangkhar's hands resting on the living root rail",
          "Wangkhar has tended this crossing for forty years.",
        ),
        right: img(
          "landscape — new roots being trained through betel trunk",
          "Young ficus roots threaded through a hollowed betel-nut trunk",
          "Young roots threaded through a hollowed betel-nut trunk — a bridge that will open around 2045.",
        ),
      },
      {
        _type: "pullQuote",
        _key: key(),
        quote:
          "A bridge is planted the way a promise is made — by someone who knows they will not live to see it kept.",
      },
      p(
        "The village school teaches bridge-tending the way other schools teach civics. Children learn which roots to braid and which to leave, and the names of the ancestors who planted the crossing they walk to class on.",
      ),
      {
        _type: "essayImage",
        _key: key(),
        fullBleed: true,
        image: img(
          "full-bleed — children crossing bridge on the way to school, monsoon light",
          "Children crossing the living root bridge on the way to school",
          "Morning crossing. The bridge carries roughly two hundred crossings a day.",
        ),
      },
      p(
        "What the bridges offer isn't nostalgia. It's a working argument about infrastructure — that the strongest things aren't finished, they're maintained. Every generation inherits a half-grown bridge and the obligation to keep training it.",
      ),
      p(
        "We left Nongriat the way everyone does: slowly, holding the rail, over something alive.",
      ),
    ],
  },
  {
    slug: "monsoon-comes-to-the-living-city",
    title: "Monsoon Comes to the Living City",
    dek: "When the rains arrive, Asia's densest neighbourhood reorganises itself overnight.",
    excerpt:
      "When the rains arrive, Asia's densest neighbourhood reorganises itself overnight. Tarpaulin, teamwork, and a thousand small acts of engineering.",
    location: "Dharavi, Mumbai",
    publishedAt: "2026-06-10",
    author: ROHIT,
    cover: img(
      "monsoon lane, blue tarps",
      "A Dharavi lane sheeted in blue tarpaulin during the first monsoon rain",
      "The first rain of June. By morning, every roof on the lane had grown a second skin.",
    ),
    tags: ["Mumbai", "Monsoon", "Informal engineering"],
    readMinutes: 9,
    photoCount: 28,
    body: [
      p(
        "The monsoon does not arrive in Dharavi. It is received. Two weeks before the first cloudburst, the lanes fill with rolls of blue tarpaulin, bamboo poles, and men on rooftops arguing about angles.",
      ),
      p(
        "Shakil, who has recycled plastic here for thirty years, calls it “the examination”. Every workshop, every loft bed, every electrical line is re-checked against a season that will find any mistake within an hour.",
      ),
      {
        _type: "pullQuote",
        _key: key(),
        quote:
          "The city above ground floods. The city that thinks in centimetres does not.",
      },
      {
        _type: "imagePair",
        _key: key(),
        left: img(
          "portrait — Shakil lashing tarp to bamboo",
          "Shakil lashing a tarpaulin sheet to a bamboo frame",
          "Shakil re-roofs his workshop in under three hours.",
        ),
        right: img(
          "landscape — rooftop web of tarps and brick weights",
          "A rooftop landscape of tarpaulin sheets weighted with bricks",
          "Bricks, ropes and old tyres hold the neighbourhood's second roof in place.",
        ),
      },
      p(
        "What looks improvised is anything but. Drainage channels are swept on a roster. Raised doorsills are measured against the memory of past floods. The neighbourhood adjusts itself the way a ship trims its sails.",
      ),
      p(
        "When the water comes — and it always comes — the lanes narrow, the work moves up a floor, and the living city keeps living.",
      ),
    ],
  },
  {
    slug: "what-the-houseboats-remember",
    title: "What the Houseboats Remember",
    dek: "Dal Lake's houseboat families have hosted travellers for four generations. Between the seasons of tourism and silence, the boats keep the stories.",
    excerpt:
      "Dal Lake's houseboat families have hosted travellers for four generations. Between the seasons of tourism and silence, the boats keep the stories.",
    location: "Srinagar, Kashmir",
    publishedAt: "2026-05-14",
    author: MEHER,
    cover: img(
      "houseboat at dusk",
      "A carved cedar houseboat on Dal Lake at dusk",
      "The Young Snow View at dusk. She was launched by the current owner's great-grandfather.",
    ),
    tags: ["Kashmir", "Dal Lake", "Four generations"],
    readMinutes: 11,
    photoCount: 31,
    body: [
      p(
        "Every houseboat on Dal Lake has two names: the one painted on its bow, and the one the family uses — usually the name of the ancestor who commissioned it.",
      ),
      p(
        "Ghulam Nabi's boat has hosted a viceroy's aide, three film crews, and forty years of honeymooners. The guest books, wrapped in plastic against the damp, go back to 1962. “People think they are staying on a boat,” he says. “They are staying inside a memory.”",
      ),
      {
        _type: "imagePair",
        _key: key(),
        left: img(
          "portrait — Ghulam Nabi with 1962 guest book",
          "Ghulam Nabi holding the oldest guest book",
          "The first guest book, started by his grandfather in 1962.",
        ),
        right: img(
          "landscape — carved cedar interior, morning light",
          "The carved cedar interior of the houseboat in morning light",
          "Every panel was carved by hand; no two boats on the lake match.",
        ),
      },
      {
        _type: "pullQuote",
        _key: key(),
        quote:
          "People think they are staying on a boat. They are staying inside a memory.",
      },
      p(
        "The hard years are recorded too — the seasons when the lake went quiet and families sold carpets, then furniture, then waited. The boats were never sold. A houseboat leaves a family the way a surname does: rarely, and never happily.",
      ),
      {
        _type: "essayImage",
        _key: key(),
        fullBleed: true,
        image: img(
          "full-bleed — shikaras crossing the lake at first light",
          "Shikara boats crossing Dal Lake at first light",
          "First light on the lake. The commute, the school run and the vegetable market all happen by shikara.",
        ),
      },
      p(
        "Restoration is slow and expensive — cedar is scarce, the craftsmen are old, and regulations are older. But every winter, somewhere on the lake, a family re-caulks a hull by hand and buys the memory another generation.",
      ),
    ],
  },
];
