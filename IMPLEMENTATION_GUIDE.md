# Design Styles & Website Types — Investigation + Implementation Guide

> **How to use this file:**  
> This document is written for an AI agent (or developer) to follow in order.  
> **Phase 1** — Investigate the existing codebase.  
> **Phase 2** — Understand the prompt-layering architecture.  
> **Phase 3** — Implement Design Styles and Website Types on top of what exists.  
> All output is **plain HTML + embedded CSS only**. No React. No build tools. No backend.

---

## PHASE 1 — INVESTIGATE THE CODEBASE

Before writing a single line, answer every question in this checklist by reading the actual project files.

### 1.1 — Entry Point & File Structure

```
TASK: Find and read the main entry file (index.html, app.js, main.js, or equivalent).
```

Look for:
- Where is the **user prompt input** captured? (textarea, input field)
- Where is the **AI API call** made? (fetch/axios call to Claude or similar)
- Where is the **HTML output rendered**? (iframe, innerHTML, preview div)
- Is there an existing **system prompt** or **prompt template**? Copy it out.

Questions to answer:
1. What is the current prompt structure sent to the AI?
2. Does a "layers" concept already exist (even partially)?
3. Where would Design Style and Website Type parameters slot in?

---

### 1.2 — Existing UI Components

```
TASK: Read all UI component files and map what already exists.
```

Look for:
- Is there already a **style selector** (dropdown, cards, tabs)? What values does it have?
- Is there already a **website type selector**? What types exist?
- Is there a **skills/features panel**? How is a skill activated (toggle, click, prompt injection)?
- What does the **output preview** area look like — iframe, div, side panel?

Document everything you find in this format:

```
FOUND:
- Style selector: [YES/NO] → current values: [list them]
- Type selector: [YES/NO] → current values: [list them]
- Skills panel: [YES/NO] → how activated: [describe]
- Preview area: [type of element] → how output is set: [describe]
- Prompt template location: [file:line]
```

---

### 1.3 — Prompt Assembly Logic

```
TASK: Trace exactly how the final prompt is built before being sent to the AI.
```

Find the function or code block that assembles the prompt. Paste it here:

```js
// PASTE EXISTING PROMPT ASSEMBLY CODE HERE BEFORE PROCEEDING
```

Understand:
- Is it a single string? A messages array?
- Is there a system prompt separate from the user prompt?
- Are any existing layers (style, type, skills) already injected? How?

---

### 1.4 — Output Rendering Pipeline

```
TASK: Understand how generated HTML reaches the user's screen.
```

- Is the output set via `iframe.srcdoc`, `innerHTML`, `document.write`, or something else?
- Is the HTML sanitized before rendering?
- Is there a **copy/download** button for the output?
- Does the preview auto-refresh or require a button click?

---

## PHASE 2 — ARCHITECTURE UNDERSTANDING

After investigating, map your project onto this architecture before implementing:

```
┌─────────────────────────────────────────────────┐
│                  USER PROMPT                    │
│         (textarea — already exists)             │
└──────────────────┬──────────────────────────────┘
                   │
       ┌───────────▼────────────┐
       │    MASTER PROMPT       │
       │    ASSEMBLER           │  ← YOU WILL EDIT THIS
       └───┬───────┬────────┬───┘
           │       │        │
    ┌──────▼──┐ ┌──▼───┐ ┌──▼──────┐
    │ DESIGN  │ │SKILL │ │WEBSITE  │
    │ STYLE   │ │LAYER │ │ TYPE    │
    │ LAYER   │ │      │ │ LAYER   │
    └─────────┘ └──────┘ └─────────┘
```

**The master prompt assembler** should produce a single string in this shape:

```
[SYSTEM CONSTRAINTS]
You are an expert HTML/CSS developer. Output ONLY valid HTML with embedded CSS.
No JavaScript frameworks. No external CSS libraries. No backend code.
Use semantic HTML5. Mobile-first responsive design using CSS Grid and Flexbox.
All styles inside a single <style> tag in <head>. Single self-contained file.

[DESIGN STYLE LAYER]
Apply the "{SELECTED_STYLE}" design system:
{STYLE_CSS_RULES}

[WEBSITE TYPE LAYER]  
Generate a "{SELECTED_TYPE}" website with these sections:
{TYPE_SECTIONS}

[SKILLS LAYER]
{ACTIVE_SKILL_INSTRUCTIONS}

[USER REQUEST]
{USER_PROMPT}
```

---

## PHASE 3 — IMPLEMENT DESIGN STYLES

### 3.1 — UI: Style Selector Component

Add a row of **clickable style cards** above or beside the prompt input.  
Each card shows: style name + a tiny color swatch strip + font preview.

```html
<!-- Style Selector UI (add to your existing layout) -->
<div class="style-selector">
  <p class="selector-label">Design Style</p>
  <div class="style-cards">
    <!-- Repeat for each style -->
    <div class="style-card" data-style="minimalist-clean" onclick="selectStyle(this)">
      <div class="swatch-row">
        <span style="background:#000"></span>
        <span style="background:#fff;border:1px solid #eee"></span>
        <span style="background:#007AFF"></span>
      </div>
      <span class="style-font" style="font-family:Inter,sans-serif">Minimalist</span>
    </div>
    <!-- ... more cards ... -->
  </div>
</div>
```

```js
let selectedStyle = "minimalist-clean"; // default

function selectStyle(card) {
  document.querySelectorAll('.style-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');
  selectedStyle = card.dataset.style;
}
```

---

### 3.2 — Style Definitions (inject into prompt)

Create a `DESIGN_STYLES` object. Each key is a style ID. Each value is the **exact CSS + typography rules** injected into the prompt layer.

```js
const DESIGN_STYLES = {

  "minimalist-clean": {
    label: "Minimalist Clean",
    swatches: ["#000000", "#FFFFFF", "#007AFF"],
    fontPreview: "Inter",
    promptLayer: `
DESIGN SYSTEM — Minimalist Clean:
- Font stack: 'Inter', system-ui, sans-serif (import from Google Fonts)
- Heading font: 'Poppins', 700 weight for all h1/h2
- Colors: --color-bg: #FFFFFF; --color-text: #111111; --color-accent: #007AFF; --color-muted: #6B7280
- Spacing: base unit 8px, sections use padding 80px 0, containers max-width 1100px
- Borders: thin 1px solid #E5E7EB only, no decorative borders
- Shadows: none or very subtle box-shadow: 0 1px 3px rgba(0,0,0,0.06)
- Buttons: flat, solid accent color, border-radius 6px, padding 12px 28px
- Images: use placeholder divs with background #F3F4F6 if no image provided
- Rule: Generous whitespace. Never crowd elements. Max 2 font sizes per section.
    `
  },

  "glassmorphism": {
    label: "Glassmorphism",
    swatches: ["#1a1a2e", "#7B61FF", "#E0AAFF"],
    fontPreview: "Nunito",
    promptLayer: `
DESIGN SYSTEM — Glassmorphism:
- Font: 'Nunito', 400/600/800 weights
- Colors: --color-bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)
- Apply this gradient as body background
- Cards/panels: background: rgba(255,255,255,0.08); backdrop-filter: blur(12px); 
  -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15);
- Text: --color-text: #FFFFFF; --color-muted: rgba(255,255,255,0.65)
- Accent: #7B61FF and #E0AAFF as gradient for buttons and highlights
- Border-radius: 16px on cards, 8px on buttons
- Shadows: box-shadow: 0 8px 32px rgba(0,0,0,0.3)
- All section containers use the glass card style above
    `
  },

  "dark-cyberpunk": {
    label: "Dark Cyberpunk",
    swatches: ["#0a0e27", "#00d4ff", "#ff006e"],
    fontPreview: "Share Tech Mono",
    promptLayer: `
DESIGN SYSTEM — Dark Cyberpunk:
- Font: 'Share Tech Mono' for headings, 'Rajdhani' for body (Google Fonts)
- Colors: --color-bg: #0a0e27; --color-surface: #0d1117; --color-accent1: #00d4ff; --color-accent2: #ff006e
- Body background: #0a0e27 with optional subtle grid overlay using CSS:
  background-image: linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
  background-size: 30px 30px;
- Text: all text #E0E0E0, headings use color: #00d4ff, text-shadow: 0 0 10px rgba(0,212,255,0.5)
- Buttons: border: 2px solid #00d4ff; color: #00d4ff; background: transparent;
  on hover: background: #00d4ff; color: #0a0e27
- Dividers: use 1px solid rgba(0,212,255,0.2)
- Highlight spans/tags: background: rgba(255,0,110,0.15); color: #ff006e; padding: 2px 8px
    `
  },

  "warm-organic": {
    label: "Warm Organic",
    swatches: ["#FEFAE0", "#D4845A", "#a8c0a0"],
    fontPreview: "Lora",
    promptLayer: `
DESIGN SYSTEM — Warm Organic:
- Fonts: 'Lora' (serif) for headings, 'Nunito' for body (Google Fonts)
- Colors: --color-bg: #FEFAE0; --color-surface: #FFF8EE; --color-accent: #D4845A; 
  --color-green: #6B8F71; --color-text: #3D2B1F; --color-muted: #7D6355
- Sections alternate background between #FEFAE0 and #FFF3E0
- Borders: border-radius 20px on cards, 50px on buttons (pill shape)
- Buttons: background: #D4845A; color: #FFF; border-radius: 50px; padding: 14px 32px
- Dividers: wavy SVG divider between sections (use CSS clip-path: ellipse)
- Shadows: soft box-shadow: 0 4px 20px rgba(212,132,90,0.15)
- Imagery: use warm-toned placeholder divs background: #F5E6D3
    `
  },

  "corporate-professional": {
    label: "Corporate",
    swatches: ["#1a3a52", "#FFFFFF", "#2E86AB"],
    fontPreview: "Merriweather",
    promptLayer: `
DESIGN SYSTEM — Corporate Professional:
- Fonts: 'Merriweather' for headings (serif), 'Source Sans Pro' for body
- Colors: --color-bg: #F7F9FC; --color-navy: #1a3a52; --color-accent: #2E86AB;
  --color-text: #2D3748; --color-muted: #718096; --color-border: #E2E8F0
- Header/navbar: background #1a3a52; color white; height 64px
- Headings: color #1a3a52; font-weight 700
- Body sections: max-width 1140px, structured 12-column grid feel
- Buttons: solid #2E86AB, border-radius 4px (sharp, professional), uppercase letter-spacing 0.5px
- Cards: white background, border: 1px solid #E2E8F0, border-radius 8px
- Tables: striped rows (#F7F9FC alternate), header row #1a3a52 white text
    `
  },

  "vibrant-retro": {
    label: "Retro Bold",
    swatches: ["#FF6B6B", "#FFE66D", "#4ECDC4"],
    fontPreview: "Righteous",
    promptLayer: `
DESIGN SYSTEM — Vibrant Retro:
- Fonts: 'Righteous' for headings, 'Poppins' 400 for body (Google Fonts)
- Colors: --color-red: #FF6B6B; --color-yellow: #FFE66D; --color-teal: #4ECDC4;
  --color-dark: #1A1A2E; --color-bg: #FFFBF0
- Backgrounds: alternate sections between --color-bg, --color-yellow, --color-red
- Borders: thick 3px solid #1A1A2E on cards and buttons (retro outline look)
- Shadows: hard offset shadow: box-shadow: 4px 4px 0px #1A1A2E (no blur)
- Buttons: background: --color-teal; border: 3px solid #1A1A2E; 
  box-shadow: 4px 4px 0 #1A1A2E; border-radius: 0; font-weight: 700; uppercase
- Headings: very large font-size (clamp 2.5rem–5rem), color #1A1A2E
- Decorative: use simple geometric shapes (circles, squares) as CSS pseudo-elements
    `
  },

  "neumorphic": {
    label: "Neumorphic",
    swatches: ["#E0E5EC", "#ffffff", "#6C63FF"],
    fontPreview: "Poppins",
    promptLayer: `
DESIGN SYSTEM — Neumorphic:
- Font: 'Poppins', 300/400/600 weights
- Colors: --color-bg: #E0E5EC; --color-surface: #E0E5EC; --color-accent: #6C63FF; --color-text: #4A4A6A
- CRITICAL: All backgrounds must be #E0E5EC — the neumorphic effect only works on a uniform background
- Cards/elements: box-shadow: 6px 6px 12px #b8bec7, -6px -6px 12px #ffffff; border-radius: 16px; background: #E0E5EC
- Buttons (raised): box-shadow: 4px 4px 8px #b8bec7, -4px -4px 8px #ffffff; border: none; background: #E0E5EC
- Buttons (pressed/active): box-shadow: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff
- Inputs: box-shadow: inset 2px 2px 5px #b8bec7, inset -2px -2px 5px #ffffff; border: none
- Accent color only for text highlights, icons, active states — never as background fill
    `
  },

  "brutalist-bold": {
    label: "Brutalist",
    swatches: ["#FFFFFF", "#000000", "#FF4136"],
    fontPreview: "Space Grotesk",
    promptLayer: `
DESIGN SYSTEM — Brutalist Bold:
- Font: 'Space Grotesk' 700/900 for everything; fallback system-ui (Google Fonts)
- Colors: --color-bg: #FFFFFF; --color-text: #000000; --color-accent: #FF4136; --color-yellow: #FFD700
- Layout: deliberately asymmetric. Break the grid intentionally. Overlapping elements via position: absolute
- Headings: font-size clamp(3rem, 8vw, 8rem); font-weight: 900; line-height: 0.9; text-transform: uppercase
- Borders: 3px–5px solid black on everything (cards, sections, buttons, inputs)
- Buttons: background: #FF4136; color: #FFF; border: 3px solid #000; border-radius: 0; 
  box-shadow: 5px 5px 0 #000; font-weight: 900; text-transform: uppercase
- Sections: some have background #FFD700, some #FF4136, some #FFF — jarring contrast is intentional
- Hover: transform: translate(3px, 3px); box-shadow: 2px 2px 0 #000 (button "press" effect)
    `
  },

  "pastel-playful": {
    label: "VoiceBox",
    swatches: ["#FAFAFA", "#0A0A0A", "#EF4444"],
    fontPreview: "Archivo Black",
    promptLayer: `
DESIGN SYSTEM — VoiceBox:
- Font: 'Archivo Black' for headings, 'Work Sans' for body (Google Fonts)
- Colors: --color-bg: #FAFAFA; --color-primary: #0A0A0A; --color-secondary: #EF4444; --color-text: #0A0A0A
- Philosophy: Bold, opinionated, magazine-style. High-contrast editorial design.
- Typography: Massive headlines (Archivo Black 56px+), sharp black-and-white foundation.
- Borders: 2px solid #0A0A0A for all structural work. No rounded corners.
- Accent: Single aggressive red (#EF4444) punctuating highlights and CTAs.
- Buttons: Square edges, 2px solid #0A0A0A border. Primary: #0A0A0A bg, #FAFAFA text. Hover: #EF4444 bg.
- Shadows: Completely flat. Hierarchy via weight and scale only.
    `
  },

  "luxury-gold": {
    label: "Luxury Gold",
    swatches: ["#1C1C1C", "#D4AF37", "#F5F0E8"],
    fontPreview: "Playfair Display",
    promptLayer: `
DESIGN SYSTEM — Luxury Gold:
- Fonts: 'Playfair Display' italic for headings, 'Cormorant Garamond' for body (Google Fonts)
- Colors: --color-bg: #0F0F0F; --color-surface: #1C1C1C; --color-gold: #D4AF37; 
  --color-gold-light: #F2D06B; --color-text: #F5F0E8; --color-muted: #9E9076
- Background: #0F0F0F with subtle noise texture using CSS:
  background-image: url("data:image/svg+xml,%3Csvg...%3E"); (use gradient instead as fallback)
- Headings: color: #D4AF37; font-style: italic; letter-spacing: 0.05em
- Dividers: use thin 1px gold lines: border-top: 1px solid rgba(212,175,55,0.3)
- Gold accent line: thin horizontal rule before section titles using ::before with background: #D4AF37
- Buttons: background: transparent; border: 1px solid #D4AF37; color: #D4AF37; 
  letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.8rem
  on hover: background: #D4AF37; color: #0F0F0F
- Cards: background: #1C1C1C; border: 1px solid rgba(212,175,55,0.2); border-radius: 2px
    `
  },

  "flat-modern": {
    label: "Flat Modern",
    swatches: ["#F0F4F8", "#3D5A80", "#EE6C4D"],
    fontPreview: "DM Sans",
    promptLayer: `
DESIGN SYSTEM — Flat Modern:
- Font: 'DM Sans' 400/500/700 (Google Fonts)
- Colors: --color-bg: #F0F4F8; --color-blue: #3D5A80; --color-coral: #EE6C4D;
  --color-navy: #293241; --color-light: #E0FBF8; --color-text: #293241
- CRITICAL RULE: No box-shadow, no border-radius above 8px, no gradients — completely flat
- Sections: use bold background color blocks to create visual separation (#3D5A80, #EE6C4D, #F0F4F8)
- Typography: create hierarchy ONLY through size and weight, not decorative elements
- Buttons: flat solid fill, border-radius 4px, no shadow, no border
- Icons: use simple Unicode symbols or minimal SVG — keep icons flat and single-color
- Hover: only color change — no movement, no shadow
    `
  },

  "3d-layered": {
    label: "Warm Earth",
    swatches: ["#FAF5EF", "#C4653A", "#6B7D3A"],
    fontPreview: "DM Serif Display",
    promptLayer: `
DESIGN SYSTEM — Warm Earth:
- Font: 'DM Serif Display' for headings, 'Source Sans 3' for body (Google Fonts)
- Colors: --color-bg: #FAF5EF; --color-surface: #FFFFFF; --color-terracotta: #C4653A; --color-olive: #6B7D3A; --color-text: #3D2E1F
- Philosophy: Creamy canvas, terracotta and olive accents, organic shapes.
- Typography: Warm, grounded headings, generous line-height (1.85) for body text.
- Layout: Narrow containers (max-width 960px) for intimate reading, generous breathing room.
- Components: Soft organic frames (border-radius 12px), subtle dividers (#E8DDD0).
- Buttons: Terracotta (#C4653A) background, 8px border-radius, warm and approachable.
- Section titles: 3px terracotta accent bar before titles.
    `
  }

};
```

---

### 3.3 — Inject Style into Master Prompt

```js
function buildMasterPrompt(userPrompt, styleId, typeId, activeSkills) {
  const style = DESIGN_STYLES[styleId];
  const type  = WEBSITE_TYPES[typeId];

  return `
You are an expert HTML and CSS developer. 
OUTPUT RULES — follow these absolutely:
- Output ONLY a complete, valid HTML file. Nothing else. No explanation.
- All CSS must be inside a single <style> tag in <head>
- No JavaScript frameworks, no React, no Vue, no jQuery
- No external CSS libraries (no Bootstrap, no Tailwind)
- You MAY import Google Fonts via @import in the <style> tag
- Use semantic HTML5: <header>, <nav>, <main>, <section>, <article>, <footer>
- Mobile-first responsive design using CSS Grid and Flexbox
- Use CSS custom properties (variables) for all colors and spacing
- The file must be completely self-contained and work when opened directly in a browser

${style.promptLayer}

${type.promptLayer}

${activeSkills.map(s => s.promptLayer).join('\n')}

USER REQUEST:
${userPrompt}
  `.trim();
}
```

---

## PHASE 4 — IMPLEMENT WEBSITE TYPES

### 4.1 — Website Type Definitions

```js
const WEBSITE_TYPES = {

  "landing-page": {
    label: "Landing Page",
    icon: "🚀",
    description: "Single-purpose conversion page",
    promptLayer: `
WEBSITE TYPE — Landing Page:
Generate a single-page site with these sections IN ORDER:
1. <header>: Sticky navbar with logo (text-based) + 3 nav links + CTA button (right-aligned)
2. <section class="hero">: Full-viewport height. Large headline (h1), subheadline (p), 
   primary CTA button, secondary ghost button. Optional: abstract decorative shape using CSS
3. <section class="social-proof">: Single row of 4–5 company logo placeholders (grey rectangles) 
   with label "Trusted by teams at..."
4. <section class="features">: h2 heading + 3-column CSS Grid of feature cards 
   (icon placeholder + title + description)
5. <section class="how-it-works">: h2 + numbered 3-step horizontal flow with connecting line
6. <section class="testimonials">: h2 + 2–3 quote cards with avatar placeholder, name, role
7. <section class="cta-final">: Full-width colored band, large heading, single CTA button
8. <footer>: Logo, 3 link columns, copyright line
    `
  },

  "portfolio": {
    label: "Portfolio",
    icon: "🎨",
    description: "Showcase work and skills",
    promptLayer: `
WEBSITE TYPE — Portfolio / Resume:
Generate a single-page portfolio with these sections:
1. <header>: Simple navbar with name as logo + nav links (Work, About, Contact)
2. <section class="hero">: Split layout — left: name, title, 2-line bio, CTA "View Work" and "Download CV"; 
   right: circular avatar placeholder (200px grey circle)
3. <section class="work">: h2 "Selected Work" + CSS Grid (2 columns) of project cards.
   Each card: image placeholder (16:9 ratio grey div) + project name + 2-word category tag + brief description
   Minimum 4 project cards.
4. <section class="skills">: Two columns — left: skills list with proficiency indicators (CSS progress bars, 
   no JS); right: brief "About Me" paragraph + education/experience timeline (CSS only)
5. <section class="contact">: Centered heading + email link styled as button + 
   row of 3–4 social icon links (use Unicode or text: GH, TW, LI, DR)
6. <footer>: Single line — name + copyright + "Made with HTML & CSS"
    `
  },

  "ecommerce": {
    label: "E-Commerce",
    icon: "🛍️",
    description: "Product showcase & store",
    promptLayer: `
WEBSITE TYPE — E-Commerce Store:
Generate a store front page with these sections (no backend, purely presentational):
1. <header>: Full navbar — logo left, nav center (Home, Shop, About, Contact), 
   right: search icon (🔍) + cart icon (🛒) with badge "3". Sticky on scroll using CSS position:sticky
2. <section class="hero-banner">: Full-width promotional banner with headline, offer text, 
   "Shop Now" CTA. Use a bold background color from the design system.
3. <section class="categories">: h2 "Shop by Category" + horizontal scroll row of 
   4–6 category cards (square, label below placeholder image div)
4. <section class="featured-products">: h2 "Featured Products" + CSS Grid 4-column product cards.
   Each card: image placeholder, product name, star rating (★★★★☆ using text), 
   price, "Add to Cart" button
5. <section class="promo-banner">: Split layout — left text offer, right placeholder image
6. <section class="new-arrivals">: Same grid as featured products, 4 different products
7. <footer>: 4-column footer — About, Shop, Support, Newsletter signup (input + button, no JS)
    `
  },

  "agency": {
    label: "Agency / Service",
    icon: "💼",
    description: "Services, team & case studies",
    promptLayer: `
WEBSITE TYPE — Agency / Service Site:
1. <header>: Logo + nav (Services, Work, Team, Contact) + "Get Quote" CTA button
2. <section class="hero">: Bold agency statement headline, subtext, two CTAs, 
   bottom strip of 4 client logo placeholders
3. <section class="services">: h2 + CSS Grid 3-column service cards with icon, title, description, 
   "Learn More" link
4. <section class="work">: Alternating layout case studies (2 total) — image left/text right, 
   then text left/image right. Each has: client name, project type, result stat, CTA link
5. <section class="stats">: Full-width colored band, 4 large numbers with labels 
   (e.g. "200+ Projects", "98% Satisfaction") in a 4-column flex row
6. <section class="team">: h2 + 4-column team member cards (circular avatar placeholder, 
   name, role, 3 social icons)
7. <section class="contact">: Two-column — left: contact info + address; right: contact form 
   (name, email, message, submit — presentational only)
8. <footer>: Standard agency footer with logo, services list, social links
    `
  },

  "blog": {
    label: "Blog / Magazine",
    icon: "✍️",
    description: "Articles, stories & content",
    promptLayer: `
WEBSITE TYPE — Blog / Magazine:
1. <header>: Publication name (styled as wordmark) + category nav + search icon. Clean, editorial feel.
2. <section class="hero-article">: Large featured article card spanning full width — 
   big image placeholder (maintain 21:9 ratio), category tag, title (large h1), author + date + 
   read time, excerpt, "Read Article" link
3. <section class="main-content">: Two-column layout (70/30 split):
   LEFT (main feed): 
     - "Latest Articles" h2 + 3 article cards (horizontal: image left, text right)
     - "Editors Pick" h2 + 2-column grid of 4 article cards
   RIGHT (sidebar):
     - About blurb card
     - "Popular Tags" cloud (styled spans)
     - "Newsletter" signup card (input + button)
     - "Most Read" list (5 numbered article links)
4. <section class="categories">: Full-width category strips — 4 category blocks each with 
   colored background, category name, article count
5. <footer>: Publication name, tagline, category links, social links, copyright
    `
  },

  "saas": {
    label: "SaaS Product",
    icon: "⚡",
    description: "Software product promo page",
    promptLayer: `
WEBSITE TYPE — SaaS Product Page:
1. <header>: Logo + nav (Product, Pricing, Docs, Blog) + "Sign In" link + "Start Free" button
2. <section class="hero">: Center-aligned. Large product claim headline, subheadline, 
   email input + "Get Started Free" button (presentational), "No credit card required" microcopy.
   Below: product UI mockup placeholder (wide grey rectangle with simulated window chrome using CSS)
3. <section class="logos">: "Used by 10,000+ teams" + 5 company logo placeholders
4. <section class="features-deep">: Alternating feature blocks (3 total) — 
   each: illustration placeholder (left or right) + heading + 3 bullet points with check icons (✓) 
   + optional CTA link
5. <section class="pricing">: h2 "Simple Pricing" + 3-column pricing cards.
   Each: plan name, price (large), period, feature list (5 items with ✓/✗), CTA button.
   Middle card: visually highlighted as "Most Popular" with badge
6. <section class="faq">: h2 + CSS-only accordion (using <details><summary>) with 5–6 Q&As
7. <section class="final-cta">: Colored band, headline, subtext, two buttons
8. <footer>: Product logo, 4 column links, social links, legal links, copyright
    `
  },

  "event": {
    label: "Event / Conference",
    icon: "🎤",
    description: "Events, conferences & meetups",
    promptLayer: `
WEBSITE TYPE — Event / Conference Page:
1. <header>: Event logo + nav (Schedule, Speakers, Venue, Register) + "Register Now" CTA
2. <section class="hero">: Full-screen. Event name (large), tagline, date + city prominently displayed,
   countdown timer display (visual only — static numbers in styled boxes: DD HH MM SS labels),
   "Register Now" button + "View Schedule" ghost button
3. <section class="about">: h2 + 3-column value props for attending + event stats strip 
   (speakers count, attendees, days, workshops)
4. <section class="speakers">: h2 "Featured Speakers" + CSS Grid 4–6 speaker cards 
   (circular avatar, name, role, company, topic tag)
5. <section class="schedule">: h2 + tabbed schedule by day (CSS-only tab via :target or checkbox hack).
   Each day: timeline list with time, talk title, speaker name, track tag
6. <section class="venue">: Split — left: venue name, address, description; 
   right: map placeholder (grey rectangle with pin emoji centered)
7. <section class="sponsors">: Logo grid by tier (Gold/Silver/Bronze) — styled placeholder rectangles
8. <section class="register">: Bold CTA section with pricing tiers and register button
9. <footer>: Event branding, nav links, social, copyright
    `
  },

  "restaurant": {
    label: "Restaurant / Venue",
    icon: "🍽️",
    description: "Food, drink & hospitality",
    promptLayer: `
WEBSITE TYPE — Restaurant / Venue:
1. <header>: Restaurant name as elegant wordmark + nav (Menu, About, Reservations, Contact).
   Transparent header over hero, becomes solid on scroll (CSS only: use position:sticky, no JS)
2. <section class="hero">: Full viewport, dark overlay on background color, 
   restaurant name centered, tagline, "View Menu" + "Reserve Table" buttons
3. <section class="intro">: 3-column: ambiance blurb + "Our Story" blurb + hours of operation card
4. <section class="menu">: h2 "Our Menu" + CSS tabs (checkbox hack) for categories: 
   Starters / Mains / Desserts / Drinks.
   Each tab: 2-column menu item list — item name left, price right, description below item name
5. <section class="specials">: Highlighted box "Today's Specials" — 2–3 featured items in cards
6. <section class="gallery">: CSS Masonry-style grid (column-count: 3) with placeholder divs 
   of varying heights and warm background colors
7. <section class="reservations">: Split — left: "Make a Reservation" form 
   (name, date, time, guests, message — presentational); right: contact info + map placeholder
8. <footer>: Name, address, phone, hours, social links
    `
  },

  "nonprofit": {
    label: "Non-Profit / Cause",
    icon: "❤️",
    description: "Charities, NGOs & causes",
    promptLayer: `
WEBSITE TYPE — Non-Profit / Cause:
1. <header>: Organization name + nav (Mission, Programs, Impact, Donate). "Donate" button in accent color.
2. <section class="hero">: Emotional, full-width hero. Large cause statement headline,
   brief emotional subtext, "Donate Now" primary CTA + "Learn More" secondary.
   Optional: urgency strip "Every donation matched until [date]"
3. <section class="mission">: h2 "Our Mission" + 2-column: left large mission statement paragraph;
   right: 3 stacked principle cards with icon + title + 1-line description
4. <section class="impact">: Full-width colored band. h2 "Our Impact" + 4 large impact stats 
   (e.g. "10,000 Families Helped", "50 Countries") in flex row. Source/year in small text below each.
5. <section class="programs">: h2 "Our Programs" + 3-column program cards: 
   image placeholder, program name, description, "Learn More" link
6. <section class="stories">: h2 "Stories of Change" + 2 horizontal story cards:
   avatar placeholder, pull quote, name, location
7. <section class="donate">: Full-width high-contrast section. h2 urgency headline.
   Donation amount selector (CSS-styled radio buttons: $10, $25, $50, $100, Custom).
   "Donate Now" large button. Trust signals: "Secure", "Tax Deductible", "100% Goes to Cause"
8. <footer>: Logo, mission tagline, program links, social links, legal, EIN number
    `
  },

  "personal-brand": {
    label: "Personal Brand",
    icon: "🌟",
    description: "Authors, creators & speakers",
    promptLayer: `
WEBSITE TYPE — Personal Brand / About:
1. <header>: First name as wordmark + nav (About, Work, Speaking, Blog, Contact). Minimal.
2. <section class="hero">: Split — left: "Hi, I'm [Name]" + title/descriptor in large type, 
   3-line bio, 2 CTAs ("Work With Me" + "Read My Writing"); 
   right: large circular avatar placeholder (300px)
3. <section class="credibility">: Horizontal strip — "As seen in" + 4–5 publication name placeholders
4. <section class="about">: Alternating — large personal photo placeholder + long-form 
   origin story paragraph (2–3 paras). Authentic, not corporate.
5. <section class="services">: h2 "How I Can Help" + 3 service cards (speaking, consulting, writing etc)
6. <section class="featured-work">: h2 + 2-column grid of 4 work/project cards
7. <section class="speaking">: If applicable — talk topics list + past event logos (placeholders)
8. <section class="newsletter">: Centered, personal tone. "Join N,000 readers" headline + 
   email input + subscribe button + "No spam, unsubscribe anytime" microcopy
9. <footer>: Name, one-liner, social links row, copyright
    `
  },

  "documentation": {
    label: "Docs / Wiki",
    icon: "📚",
    description: "Technical docs & guides",
    promptLayer: `
WEBSITE TYPE — Documentation / Wiki Site:
Layout: Two-panel fixed layout — LEFT sidebar (fixed, scrollable) + RIGHT main content area

1. <header>: Full-width top bar — logo left, search bar center (styled input, presentational),
   version badge, GitHub link, "Get Started" button. Fixed position.
2. <aside class="sidebar">: Fixed left panel (240px wide). 
   Sections: Getting Started (3 links), Core Concepts (4 links), API Reference (5 links), 
   Guides (4 links), each section with bold category label + indented links.
   Active link highlighted per design system accent color.
3. <main class="content">: Scrollable main area with:
   - Breadcrumb nav (Home > Docs > Getting Started)
   - h1 page title
   - "On this page" mini TOC (anchor links in a styled box)
   - Content blocks: paragraphs, h2/h3 headings, 
   - Code blocks: <pre><code> with monospace font + contrasting background
   - Info/Warning callout boxes (colored left border + icon ℹ️ or ⚠️)
   - A simple table with 3 columns (Option, Type, Description)
   - Next/Previous navigation buttons at bottom
4. Layout: CSS Grid — sidebar fixed, content area scrolls independently (overflow-y: auto)
    `
  },

  "coming-soon": {
    label: "Coming Soon",
    icon: "⏳",
    description: "Pre-launch & waitlist pages",
    promptLayer: `
WEBSITE TYPE — Coming Soon / Pre-Launch:
Single, focused page. No distractions. One goal: capture email or build hype.
1. <header>: Logo/brand name only. No nav links.
2. <section class="main">: Full-screen vertically centered content:
   - Optional: "Coming Soon" small uppercase tag above headline
   - Large, bold product/brand name headline
   - 1–2 sentence teaser (what is being launched)
   - Countdown timer display (visual only — styled boxes DD/HH/MM/SS with labels below)
   - Email capture: input + "Notify Me" button (presentational — no backend)
   - Social proof: "Join 1,200+ on the waitlist" in small muted text
3. <section class="features-teaser">: 3 upcoming feature pills/tags displayed 
   as blurred/obscured cards (CSS: filter: blur(2px) with "Coming Soon" overlay)
4. Social links row: 3–4 social icon links (text-based)
5. <footer>: Copyright + "© 2025 [Brand]" — single line, minimal
    `
  }

};
```

---

## PHASE 5 — INTEGRATION CHECKLIST

After implementing, verify each item works:

```
□ Selecting a Design Style updates the selectedStyle variable
□ Selecting a Website Type updates the selectedType variable
□ The buildMasterPrompt() function correctly concatenates all layers
□ The final prompt is sent to your AI API call
□ The AI response (HTML) is rendered in your preview area
□ The preview is visually correct for the selected style
□ At least 3 Design Styles produce noticeably different output
□ At least 3 Website Types produce correct section structures
□ Output HTML passes: opens in browser without errors
□ Output HTML is responsive at 375px, 768px, 1280px viewport widths
□ All styles are inside a single <style> tag (no external CSS)
□ No JavaScript frameworks appear in the output
```

---

## PHASE 6 — QUICK TEST PROMPTS

Use these to validate your implementation end-to-end:

| Test | Prompt | Style | Type | Expected |
|---|---|---|---|---|
| T1 | "A landing page for an AI writing tool called Quill" | Glassmorphism | Landing Page | Dark gradient, glass cards, hero + features |
| T2 | "My personal portfolio — I'm a UI designer from Berlin" | Minimalist Clean | Portfolio | White bg, Inter font, project grid |
| T3 | "Online store for handmade ceramics called Earth & Fire" | Warm Organic | E-Commerce | Earthy colors, product grid, rounded buttons |
| T4 | "Docs site for an open source database called FluxDB" | Flat Modern | Docs / Wiki | Sidebar layout, code blocks, clean |
| T5 | "Event page for a design conference — DesignWeek 2025" | Vibrant Retro | Event | Bold colors, speaker grid, schedule |

---

*End of Implementation Guide — Follow phases in order. Investigate before implementing.*
