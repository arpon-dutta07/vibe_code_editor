import {
  Link,
  Image,
  Search,
  Layout,
  Smile,
  Moon,
  Smartphone,
  ChevronsDown,
  Package,
  Accessibility,
  Languages,
  Sparkles,
  LucideIcon
} from "lucide-react";

export interface MarketItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
  author: string;
  downloads: string;
  trending?: boolean;
  isFree: boolean;
  price?: number; // ₹ price, only set if !isFree
}

export const CATEGORIES = ["All", "Design", "SEO", "Accessibility", "Layout", "Animation"];

export const FREE_SKILL_IDS = ["scrape-convert", "dark-mode-twin", "accessibility-auditor"];

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: "scrape-convert",
    title: "Scrape & Convert",
    description: "Paste a URL. Get a rebuilt website. Analyzes any site and reconstructs it with fresh code and your active design style.",
    category: "Design",
    icon: Link,
    author: "VibeCode Team",
    downloads: "1.2k",
    trending: true,
    isFree: true,
  },
  {
    id: "logo-to-website",
    title: "Logo to Website",
    description: "Upload a logo or describe your brand colors. Get a fully branded site with a color system derived from your identity.",
    category: "Design",
    icon: Image,
    author: "VibeCode Team",
    downloads: "980",
    trending: true,
    isFree: false,
    price: 499,
  },
  {
    id: "seo-skeleton",
    title: "SEO Skeleton Builder",
    description: "Every page, search-engine ready. Generates a full head section with OG tags, JSON-LD, and a live SERP preview card.",
    category: "SEO",
    icon: Search,
    author: "VibeCode Team",
    downloads: "2.1k",
    trending: true,
    isFree: false,
    price: 799,
  },
  {
    id: "wireframe-to-website",
    title: "Wireframe to Website",
    description: "Describe your layout in plain English. The AI builds the exact HTML structure you described, then styles it.",
    category: "Layout",
    icon: Layout,
    author: "VibeCode Team",
    downloads: "850",
    isFree: false,
    price: 399,
  },
  {
    id: "moodboard-matcher",
    title: "Moodboard Matcher",
    description: "Pick mood adjectives — Bold, Calm, Futuristic, Warm. The AI maps them to specific design micro-decisions.",
    category: "Design",
    icon: Smile,
    author: "VibeCode Team",
    downloads: "760",
    isFree: false,
    price: 299,
  },
  {
    id: "dark-mode-twin",
    title: "Dark Mode Twin",
    description: "Every site, day and night. Generates a complete dual-theme CSS system with a live toggle button in the navbar.",
    category: "Design",
    icon: Moon,
    author: "VibeCode Team",
    downloads: "1.5k",
    trending: true,
    isFree: true,
  },
  {
    id: "responsive-wizard",
    title: "Responsive Wizard",
    description: "One site, every screen. Generates explicit 375/768/1280px breakpoints and a device-frame preview section.",
    category: "Layout",
    icon: Smartphone,
    author: "VibeCode Team",
    downloads: "1.8k",
    isFree: false,
    price: 599,
  },
  {
    id: "scroll-storyteller",
    title: "Scroll Storyteller",
    description: "Your site, told one scroll at a time. Scroll-snap sections with entrance animations and a dot progress indicator.",
    category: "Animation",
    icon: ChevronsDown,
    author: "VibeCode Team",
    downloads: "920",
    isFree: false,
    price: 349,
  },
  {
    id: "component-library",
    title: "Component Library Drop",
    description: "Generate a site and its design system at once. Produces a full components.html alongside your main page.",
    category: "Design",
    icon: Package,
    author: "VibeCode Team",
    downloads: "1.1k",
    isFree: false,
    price: 999,
  },
  {
    id: "accessibility-auditor",
    title: "Accessibility Auditor",
    description: "Beautiful and usable by everyone. Full WCAG 2.1 AA compliance with a visible accessibility report panel.",
    category: "Accessibility",
    icon: Accessibility,
    author: "VibeCode Team",
    downloads: "670",
    isFree: true,
  },
  {
    id: "multilingual-switcher",
    title: "Multilingual Switcher",
    description: "One site, every direction. Full bidirectional CSS with a live LTR↔RTL toggle and logical CSS properties.",
    category: "Layout",
    icon: Languages,
    author: "VibeCode Team",
    downloads: "540",
    isFree: false,
    price: 449,
  },
  {
    id: "animation-layer",
    title: "Animation Layer",
    description: "Add motion, add life. CSS micro-interactions, staggered entrances, and an animation freeze toggle.",
    category: "Animation",
    icon: Sparkles,
    author: "VibeCode Team",
    downloads: "1.3k",
    trending: true,
    isFree: false,
    price: 649,
  },
];
