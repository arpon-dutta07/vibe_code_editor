"use client";

import * as React from "react";
import { SystemItem } from "@/features/systems/data/system-items";

interface SystemPreviewIframeProps {
  system: SystemItem;
  skillMd: string;
  theme: "light" | "dark";
}

export function SystemPreviewIframe({ system, skillMd, theme }: SystemPreviewIframeProps) {
  // Parse variables from SKILL.md
  const cssBlockMatch = skillMd.match(/```css\s*([\s\S]*?)\s*```/);
  const cssBlock = cssBlockMatch ? cssBlockMatch[1] : "";

  // Parse font import
  const importMatch = skillMd.match(/- Import:\s*`([^`]+)`/i) || skillMd.match(/- Import:\s*([^\n]+)/i);
  const importUrl = importMatch ? importMatch[1].trim() : "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";

  // Parse fonts
  const headingsMatch = skillMd.match(/-\s*Headings?:\s*`?([^`\n]+)`?/i);
  const bodyMatch = skillMd.match(/-\s*Body:\s*`?([^`\n]+)`?/i);
  const monoMatch = skillMd.match(/-\s*Mono:\s*`?([^`\n]+)`?/i);

  const headingsFont = headingsMatch ? headingsMatch[1] : "'Inter', sans-serif";
  const bodyFont = bodyMatch ? bodyMatch[1] : "'Inter', sans-serif";
  const monoFont = monoMatch ? monoMatch[1] : "'IBM Plex Mono', monospace";

  // Determine if it is a naturally dark theme
  const isNaturallyDark = ["futuristic", "glassdark", "glassmorphism", "dark-cyberpunk", "luxury-gold"].includes(system.id);
  const activeTheme = theme;

  // Build the complete srcDoc content
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en" class="${activeTheme}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${system.name} Preview</title>
      <style>
        @import url('${importUrl}');

        /* Extracted System Variables */
        ${cssBlock}

        /* Base Design Setup */
        :root {
          --theme-accent: ${system.accent};
          --theme-palette-0: ${system.palette[0]};
          --theme-palette-1: ${system.palette[1]};
          --theme-palette-2: ${system.palette[2]};

          --font-headings: ${headingsFont};
          --font-body: ${bodyFont};
          --font-mono: ${monoFont};

          --theme-bg: var(--color-bg, ${system.palette[0]});
          --theme-text: var(--color-text, ${system.palette[1] || "#111111"});
          --theme-border: var(--color-border, #e2e8f0);
          --theme-surface: var(--color-surface, #ffffff);
          --theme-surface-alt: var(--color-surface-alt, #f8fafc);
          --theme-muted: var(--color-muted, #64748b);

          --radius-btn: 8px;
          --radius-card: 12px;
          --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
          --border-thick: 1px solid var(--theme-border);
          --shadow-offset: none;
        }

        /* Dark Mode Override (Only if not naturally dark) */
        ${!isNaturallyDark ? `
        html.dark :root {
          --theme-bg: #0b0f17;
          --theme-text: #f1f5f9;
          --theme-surface: #1e293b;
          --theme-surface-alt: #0f172a;
          --theme-border: #334155;
          --theme-muted: #94a3b8;
          --shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.3);

          /* Neumorphic Dark Mode Overrides */
          ${system.id === "neumorphic" ? `
          --theme-bg: #1e2430;
          --theme-surface: #1e2430;
          --shadow-card: 9px 9px 16px rgba(0, 0, 0, 0.4), -9px -9px 16px rgba(255, 255, 255, 0.05);
          ` : ""}
        }
        ` : ""}

        /* Retro Bold Specifics */
        ${system.id === "vibrant-retro" ? `
        :root {
          --radius-btn: 0px;
          --radius-card: 0px;
          --border-thick: 3px solid #1A1A2E;
          --shadow-offset: 4px 4px 0px #1A1A2E;
        }
        ` : ""}

        /* Brutalist Specifics */
        ${system.id === "brutalist-bold" ? `
        :root {
          --radius-btn: 0px;
          --radius-card: 0px;
          --border-thick: 4px solid #000000;
          --shadow-offset: 5px 5px 0px #000000;
        }
        ` : ""}

        /* Neumorphic Specifics */
        ${system.id === "neumorphic" ? `
        :root {
          --radius-btn: 20px;
          --radius-card: 24px;
          --theme-bg: #e0e5ec;
          --theme-surface: #e0e5ec;
          --theme-border: transparent;
          --shadow-card: 9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px rgba(255, 255, 255, 0.8);
          --shadow-offset: none;
        }

        ` : ""}

        /* Glassmorphism / GlassDark Specifics */
        ${["glassmorphism", "glassdark"].includes(system.id) ? `
        :root {
          --radius-btn: 12px;
          --radius-card: 16px;
          --theme-bg: ${system.palette[0]};
          --theme-surface: rgba(255, 255, 255, 0.05);
          --theme-border: rgba(255, 255, 255, 0.08);
          --shadow-card: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          --backdrop-blur: blur(12px);
          --theme-text: #ffffff;
          --theme-muted: #a0a0c0;
        }
        ` : ""}

        /* Cyberpunk / Futuristic Specifics */
        ${["futuristic", "dark-cyberpunk"].includes(system.id) ? `
        :root {
          --radius-btn: 2px;
          --radius-card: 4px;
          --theme-bg: ${system.palette[0]};
          --theme-surface: rgba(10, 15, 30, 0.8);
          --theme-border: rgba(0, 255, 200, 0.2);
          --shadow-card: 0 0 15px rgba(0, 255, 200, 0.15);
          --theme-text: #f0f5ff;
          --theme-muted: #8899b8;
        }
        ` : ""}

        /* Luxury Gold Specifics */
        ${system.id === "luxury-gold" ? `
        :root {
          --radius-btn: 0px;
          --radius-card: 4px;
          --theme-bg: #111111;
          --theme-surface: #1c1c1c;
          --theme-border: #D4AF37;
          --theme-text: #F5F0E8;
          --theme-muted: #8a8a8a;
          --shadow-card: 0 4px 20px rgba(212, 175, 55, 0.05);
        }
        ` : ""}

        /* WarmEarth / Warm Organic Specifics */
        ${["warmearth", "warm-organic", "3d-layered"].includes(system.id) ? `
        :root {
          --radius-btn: 9999px;
          --radius-card: 20px;
        }
        ` : ""}

        /* Global Reset & Hide Scrollbars */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        ::-webkit-scrollbar {
          display: none;
        }

        html {
          scroll-behavior: smooth;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        body {
          background-color: var(--theme-bg);
          color: var(--theme-text);
          font-family: var(--font-body);
          line-height: 1.6;
          font-size: 15px;
          transition: background-color 0.3s, color 0.3s;
          padding-top: 68px; /* For fixed navbar */
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-headings);
          font-weight: 700;
          color: var(--theme-text);
          letter-spacing: -0.02em;
        }

        /* Dynamic Layout Elements */
        .preview-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 68px;
          background-color: var(--theme-surface);
          border-bottom: var(--border-thick);
          box-shadow: var(--shadow-card);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          backdrop-filter: var(--backdrop-blur, none);
          -webkit-backdrop-filter: var(--backdrop-blur, none);
        }

        .nav-logo {
          font-family: var(--font-headings);
          font-weight: 800;
          font-size: 18px;
          color: var(--theme-text);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .nav-logo span {
          color: var(--theme-accent);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .nav-link {
          color: var(--theme-muted);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--theme-accent);
        }

        .nav-badge {
          font-family: var(--font-mono);
          font-size: 11px;
          background-color: var(--theme-surface-alt);
          color: var(--theme-muted);
          padding: 3px 8px;
          border-radius: 4px;
          border: var(--border-thick);
          text-decoration: none;
        }

        .nav-cta {
          background-color: var(--theme-accent);
          color: #ffffff;
          border: none;
          border-radius: var(--radius-btn);
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.2s;
          box-shadow: var(--shadow-offset);
        }
        .nav-cta:hover {
          opacity: 0.9;
        }

        .preview-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        /* Sections */
        section {
          padding: 60px 0;
          border-bottom: var(--border-thick);
        }
        section:last-child {
          border-bottom: none;
        }

        .section-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--theme-accent);
          margin-bottom: 8px;
          display: block;
          font-weight: 600;
        }

        .section-title {
          font-size: 28px;
          margin-bottom: 24px;
        }

        /* Hero Styling */
        .hero {
          position: relative;
          text-align: left;
          padding: 80px 0;
        }

        .hero-title {
          font-size: 52px;
          line-height: 1.1;
          margin-bottom: 20px;
          font-weight: 900;
          position: relative;
        }

        .hero-desc {
          font-size: 16px;
          color: var(--theme-muted);
          max-w: 650px;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        /* Custom Accents */
        ${system.id === "techsleek" ? `
        .hero-title::after {
          content: "";
          display: block;
          width: 80px;
          height: 4px;
          background: var(--theme-accent);
          margin-top: 15px;
          border-radius: 2px;
        }
        ` : ""}

        ${system.id === "vibrant-retro" ? `
        .hero {
          background: repeating-linear-gradient(45deg, var(--theme-surface-alt), var(--theme-surface-alt) 10px, var(--theme-bg) 10px, var(--theme-bg) 20px);
          padding: 60px 20px;
          border: var(--border-thick);
          box-shadow: var(--shadow-offset);
        }
        ` : ""}

        ${system.id === "brutalist-bold" ? `
        .hero {
          border: var(--border-thick);
          padding: 40px;
          box-shadow: var(--shadow-offset);
        }
        ` : ""}

        /* Colors Section Grid */
        .colors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .color-card {
          background-color: var(--theme-surface);
          border: var(--border-thick);
          border-radius: var(--radius-card);
          padding: 12px;
          box-shadow: var(--shadow-card);
          text-align: center;
        }

        .color-block {
          width: 100%;
          height: 80px;
          border-radius: calc(var(--radius-card) - 4px);
          margin-bottom: 8px;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .color-hex {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
        }

        .color-name {
          font-size: 10px;
          color: var(--theme-muted);
          margin-top: 2px;
        }

        /* Typography Scale Section */
        .type-scale-table {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .type-scale-item {
          display: flex;
          align-items: flex-start;
          border-bottom: 1px solid var(--theme-border);
          padding-bottom: 20px;
        }
        .type-scale-item:last-child {
          border-bottom: none;
        }

        .type-meta {
          width: 200px;
          flex-shrink: 0;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--theme-muted);
        }

        .type-meta-title {
          font-weight: 700;
          color: var(--theme-text);
          margin-bottom: 4px;
        }

        .type-example {
          flex: 1;
        }

        /* Buttons Section */
        .buttons-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
        }

        .btn {
          font-family: var(--font-headings);
          padding: 12px 24px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: var(--radius-btn);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .btn-primary {
          background-color: var(--theme-accent);
          color: #ffffff;
          border: var(--border-thick);
          box-shadow: var(--shadow-offset);
        }
        .btn-primary:hover {
          opacity: 0.9;
          transform: var(--shadow-offset) !== "none" ? "translate(1px, 1px)" : "none";
        }

        .btn-secondary {
          background-color: var(--theme-surface-alt);
          color: var(--theme-text);
          border: var(--border-thick);
          box-shadow: var(--shadow-offset);
        }
        .btn-secondary:hover {
          background-color: var(--theme-border);
        }

        .btn-outline {
          background-color: transparent;
          color: var(--theme-text);
          border: var(--border-thick);
        }
        .btn-outline:hover {
          background-color: var(--theme-surface-alt);
        }

        .btn-ghost {
          background-color: transparent;
          color: var(--theme-muted);
          border: 1px solid transparent;
        }
        .btn-ghost:hover {
          color: var(--theme-text);
          background-color: var(--theme-surface-alt);
        }

        /* Neumorphic Inset Buttons */
        ${system.id === "neumorphic" ? `
        .btn-primary {
          background: #e0e5ec;
          color: var(--theme-accent);
          border: none;
          box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.8);
        }
        .btn-primary:hover {
          box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.8);
          transform: none;
        }
        .btn-secondary {
          border: none;
          box-shadow: 4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.8);
        }
        .btn-secondary:hover {
          box-shadow: inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.8);
        }
        ` : ""}

        /* Cards Section */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .preview-card {
          background-color: var(--theme-surface);
          border: var(--border-thick);
          border-radius: var(--radius-card);
          padding: 24px;
          box-shadow: var(--shadow-card);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        ${system.id === "vibrant-retro" || system.id === "brutalist-bold" ? `
        .preview-card {
          box-shadow: var(--shadow-offset);
        }
        ` : ""}

        .card-stat {
          font-family: var(--font-mono);
          font-size: 36px;
          font-weight: 700;
          color: var(--theme-accent);
          margin-top: 10px;
        }

        .card-title {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .card-desc {
          color: var(--theme-muted);
          font-size: 13px;
          margin-bottom: 20px;
          flex: 1;
        }

        /* Forms Section */
        .form-demo {
          max-width: 500px;
          background-color: var(--theme-surface);
          border: var(--border-thick);
          border-radius: var(--radius-card);
          padding: 30px;
          box-shadow: var(--shadow-card);
        }

        ${system.id === "vibrant-retro" || system.id === "brutalist-bold" ? `
        .form-demo {
          box-shadow: var(--shadow-offset);
        }
        ` : ""}

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          font-family: var(--font-headings);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 6px;
          display: block;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: var(--border-thick);
          background-color: var(--theme-surface-alt);
          color: var(--theme-text);
          border-radius: var(--radius-btn);
          font-family: var(--font-body);
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: var(--theme-accent);
        }

        .form-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          cursor: pointer;
        }

        /* Responsive Section */
        .responsive-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 16px;
        }

        .responsive-box {
          background-color: var(--theme-surface-alt);
          border: var(--border-thick);
          border-radius: var(--radius-card);
          padding: 16px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--theme-muted);
          text-align: center;
        }

        .col-4 { grid-column: span 4; }
        .col-6 { grid-column: span 6; }
        .col-12 { grid-column: span 12; }

        @media (max-width: 768px) {
          .col-4, .col-6 { grid-column: span 12; }
          .nav-links { display: none; }
        }
      </style>
    </head>
    <body>
      <nav class="preview-nav">
        <a href="#" class="nav-logo">get<span>design</span>.md</a>
        <div class="nav-links">
          <a href="#colors" class="nav-link">Colors</a>
          <a href="#typography" class="nav-link">Typography</a>
          <a href="#buttons" class="nav-link">Buttons</a>
          <a href="#cards" class="nav-link">Cards</a>
          <a href="#forms" class="nav-link">Forms</a>
          <a href="#responsive" class="nav-link">Responsive</a>
        </div>
        <div class="nav-links">
          <span class="nav-badge">awesome-design-md</span>
          <button class="nav-cta">Shop Now</button>
        </div>
      </nav>

      <div class="preview-container">
        <!-- Hero Section -->
        <section id="hero" class="hero">
          <span class="section-tag">${system.tagline}</span>
          <h1 class="hero-title">Design System Inspiration of ${system.name}</h1>
          <p class="hero-desc">${system.desc} Styled using original specifications loaded from our dynamic configuration database, preserving branding typography rules, borders, and offset shadows.</p>
          <div class="buttons-grid">
            <button class="btn btn-primary">Get Started</button>
            <button class="btn btn-secondary">Learn More</button>
          </div>
        </section>

        <!-- Colors Section -->
        <section id="colors">
          <span class="section-tag">01 / Palette</span>
          <h2 class="section-title">Color Palette</h2>
          <div class="colors-grid">
            ${system.palette.map((color, i) => `
              <div class="color-card">
                <div class="color-block" style="background-color: ${color}"></div>
                <div class="color-hex">${color.toUpperCase()}</div>
                <div class="color-name">Palette [${i}]</div>
              </div>
            `).join("")}
            <div class="color-card">
              <div class="color-block" style="background-color: ${system.accent}"></div>
              <div class="color-hex">${system.accent.toUpperCase()}</div>
              <div class="color-name">Accent Signal</div>
            </div>
          </div>
        </section>

        <!-- Typography Section -->
        <section id="typography">
          <span class="section-tag">02 / Typography</span>
          <h2 class="section-title">Typography Scale</h2>
          <p style="color: var(--theme-muted); margin-bottom: 30px; font-size: 14px;">
            Headings set in <strong>${headingsFont}</strong>. Body text rendered in <strong>${bodyFont}</strong>. 
            Monospace code and numbers rendered in <strong>${monoFont}</strong>.
          </p>
          <div class="type-scale-table">
            <div class="type-scale-item">
              <div class="type-meta">
                <div class="type-meta-title">display-xxl</div>
                <div>${headingsFont}</div>
                <div>72px / 1.0 · 700</div>
              </div>
              <div class="type-example">
                <div style="font-family: var(--font-headings); font-size: 56px; font-weight: 700; line-height: 1.1;">Limited offer</div>
              </div>
            </div>

            <div class="type-scale-item">
              <div class="type-meta">
                <div class="type-meta-title">display-xl</div>
                <div>${headingsFont}</div>
                <div>56px / 1.0 · 700</div>
              </div>
              <div class="type-example">
                <div style="font-family: var(--font-headings); font-size: 40px; font-weight: 700; line-height: 1.1;">Shop the catalog</div>
              </div>
            </div>

            <div class="type-scale-item">
              <div class="type-meta">
                <div class="type-meta-title">display-lg</div>
                <div>${headingsFont}</div>
                <div>40px / 1.1 · 600</div>
              </div>
              <div class="type-example">
                <div style="font-family: var(--font-headings); font-size: 28px; font-weight: 600; line-height: 1.2;">A device for every workflow</div>
              </div>
            </div>

            <div class="type-scale-item">
              <div class="type-meta">
                <div class="type-meta-title">body-regular</div>
                <div>${bodyFont}</div>
                <div>15px / 1.6 · 400</div>
              </div>
              <div class="type-example">
                <p style="font-family: var(--font-body); font-size: 15px; font-weight: 400;">
                  This is the standard copy text used for general descriptions, layout narratives, and paragraph spacing.
                  It maintains standard WCAG contrast ratios against the background to guarantee optimal readability.
                </p>
              </div>
            </div>

            <div class="type-scale-item">
              <div class="type-meta">
                <div class="type-meta-title">mono-numeric</div>
                <div>${monoFont}</div>
                <div>13px · Tabular</div>
              </div>
              <div class="type-example" style="font-family: var(--font-mono); font-size: 13px;">
                const theme = "${system.id}";<br>
                const isPremium = ${!system.isFree};
              </div>
            </div>
          </div>
        </section>

        <!-- Buttons Section -->
        <section id="buttons">
          <span class="section-tag">03 / Interactions</span>
          <h2 class="section-title">Buttons & Controls</h2>
          <div class="buttons-grid">
            <button class="btn btn-primary">Primary Button</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-outline">Outline Action</button>
            <button class="btn btn-ghost">Ghost Link</button>
          </div>
        </section>

        <!-- Cards Section -->
        <section id="cards">
          <span class="section-tag">04 / Containers</span>
          <h2 class="section-title">Cards Layout</h2>
          <div class="cards-grid">
            <div class="preview-card">
              <div style="font-size: 11px; font-family: var(--font-mono); text-transform: uppercase; color: var(--theme-accent);">Live Metric</div>
              <div class="card-title" style="margin-top: 5px;">Weekly Downloads</div>
              <div class="card-stat">${system.downloads}</div>
              <div class="card-desc" style="margin-top: 10px;">Downloads registered during the current cycle inside the package registry.</div>
              <button class="btn btn-secondary" style="width: 100%; font-size: 11px; padding: 8px;">View Detailed Analytics</button>
            </div>

            <div class="preview-card" style="border-top: 3px solid var(--theme-accent);">
              <div class="card-title">Product Pricing</div>
              <div style="display: flex; align-items: baseline; gap: 4px; margin: 10px 0;">
                <span style="font-size: 28px; font-weight: 800;">${system.isFree ? "Free" : "₹" + system.price}</span>
                ${!system.isFree ? `<span style="font-size: 12px; color: var(--theme-muted);">/ one-time</span>` : ""}
              </div>
              <div class="card-desc">Commercial license with source code and unlimited updates.</div>
              <button class="btn btn-primary" style="width: 100%; font-size: 11px; padding: 8px;">Activate System</button>
            </div>
          </div>
        </section>

        <!-- Forms Section -->
        <section id="forms">
          <span class="section-tag">05 / Data Entry</span>
          <h2 class="section-title">Forms & Inputs</h2>
          <div class="form-demo">
            <div class="form-group">
              <label class="form-label">Developer Email</label>
              <input type="email" class="form-input" placeholder="you@domain.com" />
            </div>
            <div class="form-group">
              <label class="form-label">Design Note</label>
              <textarea class="form-input" rows="3" placeholder="Describe your design modifications..." style="resize: none;"></textarea>
            </div>
            <div class="form-group">
              <label class="form-checkbox">
                <input type="checkbox" checked />
                <span>Agree to system terms and policies</span>
              </label>
            </div>
            <button class="btn btn-primary" style="width: 100%;">Submit Form</button>
          </div>
        </section>

        <!-- Responsive Section -->
        <section id="responsive">
          <span class="section-tag">06 / Adaptive Grid</span>
          <h2 class="section-title">Responsive Flow</h2>
          <div class="responsive-grid">
            <div class="responsive-box col-12">Header Area (col-12)</div>
            <div class="responsive-box col-4">Sidebar Nav (col-4)</div>
            <div class="responsive-box col-6">Main Analytics Canvas (col-6)</div>
            <div class="responsive-box col-4">Config Panel</div>
            <div class="responsive-box col-4">Details Deck</div>
            <div class="responsive-box col-4">Actions Tray</div>
          </div>
        </section>
      </div>

      <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(anchor => {
          anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
              });
            }
          });
        });
      </script>
    </body>
    </html>
  `;
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = React.useState<string>("800px");

  const updateThemeAndHeight = React.useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    
    // Toggle theme
    const html = doc ? doc.documentElement : null;
    if (!html) return;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    // Auto resize height
    setTimeout(() => {
      const body = doc.body;
      const htmlEl = doc.documentElement;
      if (body && htmlEl) {
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          htmlEl.clientHeight,
          htmlEl.scrollHeight,
          htmlEl.offsetHeight
        );
        if (height > 0) {
          setIframeHeight(`${height}px`);
        }
      }
    }, 150); // Small delay to let fonts and styles compute layout
  }, [theme]);

  React.useEffect(() => {
    updateThemeAndHeight();
  }, [theme, updateThemeAndHeight]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      onLoad={updateThemeAndHeight}
      title={`${system.name} Live Preview`}
      style={{ height: iframeHeight }}
      className="w-full border-0 block bg-transparent"
      sandbox="allow-scripts allow-same-origin"
      scrolling="no"
    />
  );
}
