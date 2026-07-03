export type Project = {
  id: string;
  number: string;
  title: string;
  client: string;
  category: string;
  year: number;
  image: string;
  href?: string;
  featured?: boolean;
  // Case study fields
  tagline?: string;
  overview?: string;
  role?: string[];
  scope?: string[];
  region?: string;
  context?: string;
  approach?: string;
  outcome?: string;
};

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug);
}

export function getAdjacentProjects(slug: string) {
  const idx = projects.findIndex((p) => p.id === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  const prev = projects[(idx - 1 + projects.length) % projects.length];
  const next = projects[(idx + 1) % projects.length];
  return { prev, next };
}

const STRATEGY_ROLE = [
  "Creative Strategy",
  "Concept",
  "Art Direction",
];
const PROD_ROLE = [
  "Creative Strategy",
  "Production",
  "Optimization",
];

export const projects: Project[] = [
  {
    id: "levis-150",
    number: "01",
    title: "The Greatest Story Ever Worn",
    client: "Levi's",
    category: "Anniversary Campaign",
    year: 2024,
    image: "/work/levis-150.jpg",
    featured: true,
    tagline: "Heritage, retold for a feed.",
    overview:
      "Anniversary brand work supporting Levi's 150-year milestone — translating an iconic legacy into culturally resonant, performance-aware creative for digital channels.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Social storytelling", "Adaptations"],
    region: "Global",
  },
  {
    id: "gucci",
    number: "02",
    title: "See Your World",
    client: "Gucci",
    category: "Luxury Brand",
    year: 2024,
    image: "/work/gucci.jpg",
    featured: true,
    tagline: "Luxury, the way an algorithm should never see it.",
    overview:
      "Brand-led creative work for one of the most photographed luxury houses in the world — protecting aesthetic codes while engineering for digital attention.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Art direction", "Adaptations"],
    region: "EU",
  },
  {
    id: "vans",
    number: "03",
    title: "Off The Wall — Classics",
    client: "Vans",
    category: "Brand Campaign",
    year: 2021,
    image: "/work/vans.jpg",
    featured: true,
    tagline: "A heritage line, told to a generation that never lived through it.",
    overview:
      "Brand campaign work for the Vans Classics line — channeling skate culture's authenticity into formats built for paid social and full-funnel performance.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Social", "Video"],
    region: "Global",
  },
  {
    id: "mercedes",
    number: "04",
    title: "Mercedes × Fashion Week",
    client: "Mercedes",
    category: "Social Campaign",
    year: 2024,
    image: "/work/mercedes.jpg",
    featured: true,
    tagline: "When automotive meets the runway.",
    overview:
      "Social activation work pairing Mercedes with Fashion Week moments — bridging luxury automotive heritage with the cultural pace of fashion content.",
    role: STRATEGY_ROLE,
    scope: ["Social storytelling", "Editorial direction"],
    region: "EU",
  },
  {
    id: "n26",
    number: "05",
    title: "Seamless Banking for Every Moment",
    client: "N26",
    category: "Financial Services",
    year: 2024,
    image: "/work/n26.jpg",
    tagline: "Trust at the speed of a swipe.",
    overview:
      "Performance-led creative for the digital-native challenger bank — translating product moments into mobile-first ads that earn the tap.",
    role: PROD_ROLE,
    scope: ["Paid social", "Mobile video", "Adaptations"],
    region: "EU",
  },
  {
    id: "ca-drive",
    number: "06",
    title: "Drive to Store Activation",
    client: "C&A",
    category: "Retail Activation",
    year: 2024,
    image: "/work/ca-drive.jpg",
    tagline: "From feed to footfall.",
    overview:
      "Drive-to-store activation built for a heritage European retail brand — engineered for measurable in-store conversion, not just clicks.",
    role: PROD_ROLE,
    scope: ["Performance creative", "Localization", "Animation"],
    region: "EU",
  },
  {
    id: "saie",
    number: "07",
    title: "Dermatology Meets Natural Elegance",
    client: "SAIE",
    category: "Beauty",
    year: 2024,
    image: "/work/saie.jpg",
    tagline: "Clinical claims, told beautifully.",
    overview:
      "Beauty creative balancing dermatological credibility with the visual standards of a category that lives or dies on aesthetic.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Art direction", "Paid social"],
    region: "US",
  },
  {
    id: "swag-donuts",
    number: "08",
    title: "Follow the Sugar Cravings",
    client: "Swag Donuts",
    category: "Food & Beverage",
    year: 2024,
    image: "/work/swag-donuts.jpg",
    tagline: "Engineered for the impulse tap.",
    overview:
      "F&B creative built around craving cues — short-form, mouth-feel-first content tuned for thumb-stopping social performance.",
    role: PROD_ROLE,
    scope: ["Social", "Video", "Photography direction"],
    region: "MENA",
  },
  {
    id: "cadillac",
    number: "09",
    title: "ATS Coupe — Middle East",
    client: "Cadillac",
    category: "Automotive",
    year: 2016,
    image: "/work/cadillac.jpg",
    tagline: "American luxury, regionally grounded.",
    overview:
      "Regional automotive campaign work for Cadillac Middle East — translating an American luxury icon for a market with its own taste codes.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Regional adaptation", "Print + digital"],
    region: "MENA",
  },
  {
    id: "maggi",
    number: "10",
    title: "Elevate Your Soup Experience",
    client: "Maggi",
    category: "FMCG",
    year: 2024,
    image: "/work/maggi.jpg",
    tagline: "The everyday product, treated like an event.",
    overview:
      "FMCG creative work for a household staple — using craft-grade art direction to elevate a category often treated as a price game.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Photography direction", "Adaptations"],
    region: "MENA",
  },
  {
    id: "carswitch-dpa",
    number: "11",
    title: "DPA for META",
    client: "CarSwitch",
    category: "Dynamic Product Ads",
    year: 2024,
    image: "/work/carswitch-dpa.jpg",
    tagline: "A creative system, not a creative.",
    overview:
      "Dynamic Product Ads at scale on Meta — a templated creative system that adapts inventory, pricing and offer logic without losing brand integrity.",
    role: PROD_ROLE,
    scope: ["DCO", "Templating", "Performance creative"],
    region: "MENA",
  },
  {
    id: "carswitch-ugc",
    number: "12",
    title: "UGC Campaign — TikTok + META",
    client: "CarSwitch",
    category: "User-Generated Content",
    year: 2024,
    image: "/work/carswitch-ugc.jpg",
    tagline: "Native voice, brand-safe rails.",
    overview:
      "Creator-led UGC campaign engineered for TikTok and Meta — capturing the platform-native voice without surrendering on-brand performance discipline.",
    role: PROD_ROLE,
    scope: ["UGC strategy", "Creator briefs", "Editing direction"],
    region: "MENA",
  },
  {
    id: "4cs-playbook",
    number: "13",
    title: "4Cs of Creative Effectiveness",
    client: "Global Playbook",
    category: "Creative Strategy",
    year: 2024,
    image: "/work/4cs-playbook.jpg",
    tagline: "The framework I run my own work through.",
    overview:
      "An internal creative-effectiveness playbook codifying the four Cs that separate ads that compound from ads that fatigue. Used in audits, training and workshops.",
    role: ["Author", "Strategy", "Workshop facilitation"],
    scope: ["Framework design", "Training material"],
    region: "Global",
  },
  {
    id: "paid-social",
    number: "14",
    title: "Interactive, Video & Dynamic",
    client: "Paid Social",
    category: "Multi-Client",
    year: 2024,
    image: "/work/paid-social.jpg",
    tagline: "Across formats, across brands.",
    overview:
      "A working sample across paid social — interactive, video and dynamic product formats — drawn from multiple client engagements.",
    role: PROD_ROLE,
    scope: ["Paid social", "Video", "Interactive"],
    region: "MENA · EU · US",
  },
  {
    id: "video-ads",
    number: "15",
    title: "Video Ads Collection",
    client: "Multiple",
    category: "Video Advertising",
    year: 2024,
    image: "/work/video-ads.gif",
    tagline: "Mobile-first, hooked in the first 1.5 seconds.",
    overview:
      "A reel of selected video ads — built for mobile feeds where the first second is the entire pitch.",
    role: PROD_ROLE,
    scope: ["Video", "Mobile-first edit", "Multi-format"],
    region: "Global",
  },
  {
    id: "diyanu",
    number: "16",
    title: "African-Inspired Fashion — Spec",
    client: "D'IYANU",
    category: "Fashion",
    year: 2023,
    image: "/work/diyanu.jpg",
    tagline: "A spec brief, treated like a paying one.",
    overview:
      "Spec creative work for D'IYANU — exploring how African-inspired fashion translates into performance-grade ad creative without losing cultural specificity.",
    role: STRATEGY_ROLE,
    scope: ["Concept", "Art direction", "Spec ads"],
    region: "US",
  },
  {
    id: "baur",
    number: "17",
    title: "Spring Collection",
    client: "Baur.de",
    category: "Fashion / Retail",
    year: 2024,
    image: "/work/baur.jpg",
    tagline: "Catalogue-thinking, feed-formatting.",
    overview:
      "Seasonal collection work for a German fashion retailer — bridging catalogue product breadth with social-native creative formats.",
    role: PROD_ROLE,
    scope: ["Performance creative", "Localization"],
    region: "EU",
  },
  {
    id: "berlin-fw",
    number: "18",
    title: "Transcendental Transformation",
    client: "Berlin Fashion Week",
    category: "Fashion Event",
    year: 2024,
    image: "/work/berlin-fw.jpg",
    tagline: "An event, photographed for the algorithm.",
    overview:
      "Creative coverage for Berlin Fashion Week — translating a live cultural moment into editorial-grade content built for fragmented attention.",
    role: STRATEGY_ROLE,
    scope: ["Editorial direction", "Social"],
    region: "EU",
  },
  {
    id: "collages",
    number: "19",
    title: "Collages",
    client: "Personal",
    category: "Art Direction",
    year: 2024,
    image: "/work/collages.jpg",
    tagline: "The studio practice that feeds the client work.",
    overview:
      "An ongoing personal collage practice — a private lab for visual ideas that eventually find their way into commercial briefs.",
    role: ["Art direction", "Concept", "Visual development"],
    scope: ["Personal practice"],
    region: "Studio",
  },
  {
    id: "dualities",
    number: "20",
    title: "Complicated Dualities",
    client: "Personal",
    category: "Conceptual Art",
    year: 2023,
    image: "/work/dualities.jpg",
    tagline: "Two truths in one frame.",
    overview:
      "A personal series exploring tension and contrast — the kind of conceptual rigor that, applied to a brief, becomes a campaign idea.",
    role: ["Concept", "Art direction"],
    scope: ["Personal practice"],
    region: "Studio",
  },
  {
    id: "prixim",
    number: "21",
    title: "Digital Wall Art Collection",
    client: "Prixim.com",
    category: "Digital Art",
    year: 2024,
    image: "/work/prixim.jpg",
    tagline: "From advertising into editions.",
    overview:
      "A digital wall-art collection released through Prixim — translating a creative-director's eye into pieces designed to hang.",
    role: ["Artist", "Art direction"],
    scope: ["Digital art", "Edition design"],
    region: "Global",
  },
  {
    id: "automotive-photo",
    number: "22",
    title: "Automotive Photography",
    client: "Personal",
    category: "Photography",
    year: 2024,
    image: "/work/automotive-photo.jpg",
    tagline: "Why the cars in client decks look the way they do.",
    overview:
      "A personal photography practice focused on automotive form and light — the technical eye behind the automotive briefs in this portfolio.",
    role: ["Photographer", "Art direction"],
    scope: ["Photography"],
    region: "Studio",
  },
  {
    id: "spatial-glitch",
    number: "23",
    title: "Spatial Glitch",
    client: "Personal",
    category: "Experimental",
    year: 2023,
    image: "/work/spatial-glitch.jpg",
    tagline: "Where the medium starts misbehaving.",
    overview:
      "An experimental series investigating image breakdown, interference and spatial distortion — a sandbox for AI-era visual languages.",
    role: ["Artist", "Concept"],
    scope: ["Experimental", "AI workflows"],
    region: "Studio",
  },
];

export const clients = [
  "Vans",
  "Levi's",
  "Gucci",
  "Mercedes",
  "Cadillac",
  "N26",
  "C&A",
  "Maggi",
  "SAIE",
  "Berlin Fashion Week",
  "Baur.de",
  "CarSwitch",
];

export const services = [
  {
    n: "01",
    title: "Creative Audits & Optimization",
    body: "I dissect ad performance to find what's eating your spend. AI-powered attention mapping, fatigue detection, platform compliance, competitor benchmarking — turned into design changes you can actually ship.",
  },
  {
    n: "02",
    title: "Full-Funnel Creative Strategy",
    body: "Awareness through conversion, mapped as a creative system. Roadmaps, DCO and automation strategy, A/B frameworks, regional adaptation — built for teams that want to compound learnings, not chase trends.",
  },
  {
    n: "03",
    title: "Ad Creative Production",
    body: "Mobile-first video, conversion-focused statics, platform adaptations at scale. AI-assisted where it earns its place, hand-crafted where it has to count.",
  },
  {
    n: "04",
    title: "Training & Workshops",
    body: "I teach in-house teams to think like a creative strategist and ship like a performance one. Hands-on audits, AI tooling, testing discipline — leveling up the people who do the work every day.",
  },
];
