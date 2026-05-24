import { 
  Code2, 
  Palette, 
  Database, 
  Globe, 
  Zap, 
  Terminal, 
  Github, 
  Cpu,
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
}

export const CATEGORIES = ["All", "Skills", "Tools", "Templates", "Architecture", "Integrations"];

export const MARKET_ITEMS: MarketItem[] = [
  {
    id: "frontend-design",
    title: "Frontend Design Skill",
    description: "Advanced principles for distinctive, production-grade frontend development. Includes color theory and spacing.",
    category: "Skills",
    icon: Palette,
    author: "VibeCode Team",
    downloads: "1.2k",
    trending: true,
  },
  {
    id: "architecture-design",
    title: "Backend Architecture",
    description: "Templates and best practices for scalable Node.js and Go backends with clean architecture.",
    category: "Architecture",
    icon: Database,
    author: "Architects Inc",
    downloads: "850",
  },
  {
    id: "ci-cd-pipelines",
    title: "GitHub Actions Automator",
    description: "Automatically generate and optimize CI/CD pipelines for your projects.",
    category: "Integrations",
    icon: Github,
    author: "DevOps Pro",
    downloads: "2.1k",
  },
  {
    id: "testing-scripts",
    title: "Testing Scripts Plus",
    description: "Enhanced runtime for testing with pre-installed common dev tools.",
    category: "Tools",
    icon: Cpu,
    author: "VibeCode Team",
    downloads: "3.4k",
  },
  {
    id: "frontend",
    title: "Modern React Starter",
    description: "Opinionated React starter with Tailwind 4, Shadcn, and TanStack Query.",
    category: "Templates",
    icon: Globe,
    author: "VibeCode Team",
    downloads: "1.5k",
  },
  {
    id: "logging",
    title: "Vibe Logger",
    description: "Deep dive into your code's performance metrics with AI-driven suggestions.",
    category: "Tools",
    icon: Zap,
    author: "SpeedLab",
    downloads: "920",
  },
  {
    id: "database-selection",
    title: "SQL Smart Query",
    description: "Let the AI optimize your PostgreSQL queries for maximum efficiency.",
    category: "Skills",
    icon: Terminal,
    author: "DB Masters",
    downloads: "1.1k",
    trending: true,
  },
  {
    id: "backend",
    title: "Instant API",
    description: "Generate full REST or GraphQL APIs from your database schema in seconds.",
    category: "Tools",
    icon: Code2,
    author: "VibeCode Team",
    downloads: "2.5k",
    trending: true,
  }
];
