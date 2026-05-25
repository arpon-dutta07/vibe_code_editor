# Skills — Complete Reference Guide

> **What is a Skill?**  
> A Skill is a specialized generation module that wraps around the user's prompt and the master prompt to give the AI a specific superpower. Each skill adds a focused instruction layer that changes *how* the HTML is structured, *what extra features* are included, or *what transformations* are applied to the output. Skills are composable — multiple can be active at once.

---

## How Skills Fit Into the Prompt Architecture

```
USER PROMPT
    +
DESIGN STYLE LAYER
    +
WEBSITE TYPE LAYER
    +
[ SKILL LAYER ]   ← Skills inject here
    =
MASTER PROMPT → AI → HTML Output
```

Each skill has:
- A **UI trigger** (button, toggle, or input in the frontend)
- A **prompt layer** (text injected into the master prompt)
- A **visual output** (what the user sees that proves the skill worked)

---

## Skill 01 — Scrape & Convert

**Tagline:** *Paste a URL. Get a website.*

### What It Does
The user provides a URL of any existing website. The skill instructs the AI to analyze the URL's content and structure, then reconstruct it as a clean, semantic HTML page styled with the chosen Design Style. It doesn't copy the site — it rebuilds the *idea* of it with better code and a fresh visual layer.

### Frontend UI
- A secondary input field appears below the main prompt: `"Paste a website URL to inspire from"`
- A "Scrape & Convert" badge appears on the output to indicate the skill was active
- Optional: side-by-side preview — left shows the original URL in an iframe, right shows the generated version

### Prompt Layer Injected
```
SKILL — Scrape & Convert:
The user has provided this reference URL: {USER_URL}
Analyze what kind of website this is (landing page, portfolio, blog, etc).
Identify its core sections, content hierarchy, and navigation structure.
Rebuild it as a clean, semantic HTML5 page from scratch — do not copy any code.
Use the active Design Style for all visual decisions.
Preserve the content purpose and structure but make the design entirely new.
```

### Visual Proof It Worked
The generated site mirrors the section structure of the reference URL but looks completely different — like a redesign.

---

## Skill 02 — Logo to Website

**Tagline:** *Upload a logo. Get a branded site.*

### What It Does
The user uploads a logo image. The skill extracts (or the user describes) the dominant colors from the logo, then the AI generates a fully branded website where every color, typography tone, and visual decision is derived from the logo's identity. The result feels like a real brand — not a generic template.

### Frontend UI
- A file upload input appears: `"Upload your logo (PNG/SVG)"`
- After upload, a color extraction step runs — either via a Canvas API color picker on the frontend, or the user manually picks 2–3 dominant colors using a color input
- The extracted palette is shown as swatches before generation
- The active Design Style is overridden with brand colors

### Prompt Layer Injected
```
SKILL — Logo to Website:
The user has provided a logo. The brand's dominant colors are: {COLOR_1}, {COLOR_2}, {COLOR_3}.
Build the entire site's color system around these exact colors:
- Primary brand color: {COLOR_1} — use for buttons, links, accents, active states
- Secondary color: {COLOR_2} — use for section backgrounds, card accents, dividers
- Neutral/background: {COLOR_3} or derive a suitable light/dark neutral from the palette
Override the Design Style color variables with these brand colors but keep the Design Style's
typography, spacing, and layout rules intact.
Include the logo in the <header> as an <img> tag with src="logo.png" and appropriate sizing.
Every section should feel like it belongs to one coherent brand.
```

### Visual Proof It Worked
The site's color palette exactly matches the uploaded logo. The navbar uses the logo image. The overall site feels like it was designed specifically for that brand.

---

## Skill 03 — SEO Skeleton Builder

**Tagline:** *Every page, search-engine ready from line one.*

### What It Does
This skill instructs the AI to generate a fully populated `<head>` section with every SEO-critical tag: meta description, Open Graph tags, Twitter Card tags, canonical URL, JSON-LD structured data, and semantic HTML that search engines can crawl cleanly. It also adds a visible "SEO Preview Card" section at the bottom of the generated page showing how the site would appear in Google search results and on social media shares.

### Frontend UI
- A toggle switch: "SEO Skeleton Builder — ON/OFF"
- When ON, two optional input fields appear: `"Page description (meta)"` and `"Target keyword"`
- After generation, an SEO Preview Card renders below the main preview showing:
  - Google SERP simulation (title, URL, description snippet)
  - Open Graph card simulation (how it looks when shared on Twitter/LinkedIn)

### Prompt Layer Injected
```
SKILL — SEO Skeleton Builder:
Generate a complete, production-ready <head> section with every SEO tag:

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{PAGE_TITLE} | {BRAND_NAME}</title>
  <meta name="description" content="{META_DESCRIPTION — 150-160 chars, include target keyword}">
  <meta name="keywords" content="{3-5 relevant keywords}">
  <link rel="canonical" href="https://example.com/">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{PAGE_TITLE}">
  <meta property="og:description" content="{META_DESCRIPTION}">
  <meta property="og:url" content="https://example.com/">
  <meta property="og:image" content="https://example.com/og-image.jpg">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{PAGE_TITLE}">
  <meta name="twitter:description" content="{META_DESCRIPTION}">
  <meta name="twitter:image" content="https://example.com/og-image.jpg">
  
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "{BRAND_NAME}",
    "url": "https://example.com"
  }
  </script>
</head>

Additionally:
- Use only semantic HTML5 elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>
- Every image placeholder must have a descriptive alt attribute
- All headings must follow a strict hierarchy: one <h1>, multiple <h2>, <h3> as needed
- Add a hidden <section> at the very bottom of the page styled as an SEO preview panel:
  Show a mocked Google SERP result card and a mocked OG social share card using pure HTML/CSS
```

### Visual Proof It Worked
The `<head>` tag is fully populated. At the bottom of the preview, a real-looking Google search result card and a social share card are rendered using HTML/CSS — visible proof without needing any external tool.

---

## Skill 04 — Wireframe to Website

**Tagline:** *Describe your layout in plain English. Watch it appear.*

### What It Does
The user describes a rough page layout in plain language — like a verbal sketch. The skill converts that description into a precise HTML structure, then applies the active Design Style on top. It's like going from a napkin sketch to a coded layout in one step. The output optionally shows the wireframe skeleton (grey boxes) alongside the styled version.

### Frontend UI
- A secondary textarea appears: `"Describe your layout (e.g. 'hero full width, then 3 columns, sidebar on the right, footer with 2 rows')"` 
- A toggle: "Show wireframe overlay" — when ON, adds a wireframe-style view (grey outlines, no color) as a split view alongside the styled output
- The wireframe view uses a CSS class `.wireframe-mode` toggled on `<body>`

### Prompt Layer Injected
```
SKILL — Wireframe to Website:
The user has described their desired layout: "{LAYOUT_DESCRIPTION}"

Parse this layout description carefully and build the exact HTML structure they described:
- Translate layout terms: "3 columns" = CSS Grid with 3 equal columns, 
  "sidebar" = aside element with fixed width, "hero" = full-width section with min-height 80vh,
  "split" = two equal flex children, "strip" = full-width narrow band section
- Build the structure first, then apply the Design Style visuals on top
- Add a CSS class system: every major layout section gets a descriptive class name matching 
  the user's description (e.g. class="three-col-features", class="right-sidebar")

Additionally, add a wireframe mode toggle to the generated page:
- A small button fixed to the bottom-right corner: "Toggle Wireframe"
- When clicked, it adds/removes a class "wireframe-mode" on <body>
- In wireframe-mode: all backgrounds become #F5F5F5, all text becomes #999, 
  all elements get a 2px dashed #CCCCCC border, images become grey boxes
- This lets the user see the structure clearly separate from the design
```

### Visual Proof It Worked
The generated layout exactly matches the user's described structure. The wireframe toggle reveals the pure layout skeleton — a compelling before/after that demonstrates the structural logic clearly.

---

## Skill 05 — Moodboard Matcher

**Tagline:** *Pick three words. Get a design that feels exactly right.*

### What It Does
The user selects 3–5 adjective tags that describe the feeling they want (e.g. "Bold", "Calm", "Futuristic", "Friendly", "Minimal", "Playful"). The skill maps those adjectives to specific design decisions — font weight, color temperature, spacing density, border-radius, animation speed — and layers those micro-decisions on top of the active Design Style, personalizing it further.

### Frontend UI
- A tag-picker grid appears with 20–25 adjective pills (clickable, multi-select, max 5)
- Example adjectives: Bold · Calm · Playful · Serious · Futuristic · Warm · Cold · Minimal · Loud · Soft · Trustworthy · Edgy · Elegant · Friendly · Fast · Premium · Raw · Dreamy · Sharp · Cozy
- Selected tags display as active chips
- A subtle preview of the mood color temperature (warm/cool spectrum bar) updates as tags are selected

### Adjective → Design Decision Map (internal logic)
```
Bold       → font-weight: 900, large headings, high contrast colors
Calm       → muted palette, generous whitespace, slow transitions (0.4s)
Playful    → high border-radius, bright accent pops, slight rotations on decorative elements
Serious    → serif fonts, dark navy/charcoal, structured grid, minimal decoration
Futuristic → monospace or geometric sans, dark bg, cyan/purple accents, sharp corners
Warm       → color temperature shift to oranges/yellows/reds, soft shadows
Cold       → blues/teals/whites, crisp shadows, clinical spacing
Minimal    → maximum whitespace, reduce elements by 30%, muted palette
Loud       → increase heading size by 20%, bold color fills on sections
Elegant    → thin font weights, generous letter-spacing, gold/cream accents
Premium    → dark background, gold accents, serif headings, refined spacing
```

### Prompt Layer Injected
```
SKILL — Moodboard Matcher:
The user has selected these mood adjectives: {SELECTED_TAGS}

Apply these design micro-decisions on top of the active Design Style:
{MAPPED_RULES_FROM_ADJECTIVES}

These mood rules override specific properties of the Design Style where they conflict.
The overall aesthetic should feel exactly like the selected adjectives describe —
someone looking at the site should immediately feel {SELECTED_TAGS[0]} and {SELECTED_TAGS[1]}.
```

### Visual Proof It Worked
Two different mood combinations on the same Website Type and Design Style produce noticeably different outputs — different spacing density, font weight, color temperature, and decoration level.

---

## Skill 07 — Responsive Wizard

**Tagline:** *One site. Every screen. No guessing.*

### What It Does
This skill forces the AI to generate a fully responsive HTML file with explicit breakpoints for mobile (375px), tablet (768px), and desktop (1280px). It generates a device frame preview — three CSS-drawn device mockups (phone, tablet, laptop) — embedded in the page itself, showing how the layout reflows at each breakpoint.

### Frontend UI
- A toggle: "Responsive Wizard — ON"
- After generation, the preview area shows three device frames side by side (drawn entirely in CSS):
  - 📱 Phone frame (375px content width)
  - 📱 Tablet frame (768px content width)  
  - 💻 Laptop frame (full width)
- Each frame contains the generated site in a scaled iframe
- A "Check Breakpoints" button highlights all media query boundaries visually

### Prompt Layer Injected
```
SKILL — Responsive Wizard:
Generate a fully responsive layout with explicit CSS media queries for three breakpoints:

Mobile-first base styles (applies to all screen sizes, ~375px):
- Single column layout for all grid sections
- Full-width elements: nav, hero, cards, images
- Font sizes: base 16px, h1 clamp(2rem, 8vw, 3rem), h2 clamp(1.5rem, 5vw, 2rem)
- Navbar: hamburger menu layout (CSS-only: use checkbox hack for mobile menu)
- Padding: sections use padding: 48px 20px
- Hide any decorative side elements

Tablet breakpoint @media (min-width: 768px):
- 2-column grid for feature/card sections
- Show sidebar if present (2-column layout: 65/35 split)
- Increase section padding to: 64px 32px
- Navigation: show full horizontal nav (hide checkbox hack menu)
- Font sizes increase by ~15%

Desktop breakpoint @media (min-width: 1280px):
- Full layout: 3+ column grids, full sidebar visible
- Section padding: 80px 0, inner container max-width: 1140px, margin: 0 auto
- All decorative elements visible
- Font sizes at maximum values

Additionally, add an embedded device preview section at the BOTTOM of the generated HTML:
Three CSS-drawn device frames (use border-radius, box-shadow, and overflow:hidden to create 
phone/tablet/laptop outlines). Each device contains a scaled-down iframe or screenshot of 
the main content. Label each device with its breakpoint width.
```

### Visual Proof It Worked
The device preview section at the bottom of the page shows three distinct layouts — the mobile version is clearly single-column, the tablet is 2-column, the desktop is full-width. The media queries are explicit and labeled with comments in the `<style>` tag.

---

## Skill 10 — Accessibility Auditor

**Tagline:** *Beautiful and usable by everyone.*

### What It Does
This skill adds a complete accessibility layer to the generated HTML — ARIA roles, labels, keyboard navigation, focus states, skip links, and color contrast compliance. It also generates a visible Accessibility Report Panel at the bottom of the page: a styled checklist showing every accessibility feature that was added, with green checkmarks and explanations.

### Frontend UI
- A toggle: "Accessibility Auditor — ON"
- After generation, a collapsible "Accessibility Report" panel appears at the bottom of the preview:
  - Green ✓ / Red ✗ checklist of accessibility features
  - Items like: `✓ Skip to content link`, `✓ All images have alt text`, `✓ Color contrast ratio ≥ 4.5:1`, `✓ Focus styles visible`, `✓ Form inputs have labels`
- A contrast checker badge shows in the corner of the preview

### Prompt Layer Injected
```
SKILL — Accessibility Auditor:
Generate the HTML with full WCAG 2.1 AA accessibility compliance:

Structure & Semantics:
- First element inside <body>: <a href="#main-content" class="skip-link">Skip to main content</a>
  Style it: position:absolute; transform:translateY(-100%); on :focus: transform:translateY(0)
- Every page landmark must have an ARIA role: role="banner" (header), role="navigation" (nav),
  role="main" (main), role="contentinfo" (footer)
- All nav elements: <nav aria-label="Primary navigation">
- Use aria-label on icon-only buttons and links

Images & Media:
- Every <img> must have a descriptive alt attribute (not empty, not "image of")
- Decorative placeholder divs: aria-hidden="true"

Forms & Interactivity:
- Every input must have an associated <label> with matching for/id attributes
- Buttons must have descriptive text (not just "Click here" or "Submit")
- All interactive elements must be reachable via Tab key (no tabindex="-1" on interactive elements)

Color & Contrast:
- Text on backgrounds must maintain ≥ 4.5:1 contrast ratio for normal text, 3:1 for large text
- Never convey information by color alone — always pair with text or icon
- Focus styles: all :focus states must have a visible 3px outline (do not use outline:none)

At the bottom of the <body>, add a styled Accessibility Report Panel:
<section class="a11y-report" aria-label="Accessibility Report">
  A styled checklist of every accessibility feature added, with green checkmark icons.
  Include: skip link ✓, ARIA landmarks ✓, alt text ✓, form labels ✓, focus styles ✓,
  color contrast ✓, keyboard navigation ✓
  Style this panel with a light green background, bordered, collapsible via <details><summary>
</section>
```

### Visual Proof It Worked
The Accessibility Report Panel at the bottom lists every WCAG feature added with green checkmarks. Tab-navigating through the page shows clear focus indicators. The skip link appears on first tab press.

---

## Skill 12 — Animation Layer

**Tagline:** *Add motion. Add life.*

### What It Does
This skill adds a complete set of CSS micro-interactions and entrance animations to the generated HTML — hover effects on buttons and cards, scroll-triggered entrance animations (CSS-only using `@keyframes` + `animation-play-state`), and a smooth page load sequence. An "Animation Mode" toggle on the generated page lets the user turn all animations ON/OFF to compare the static vs animated versions.

### Frontend UI
- A dropdown: "Animation Intensity" → Subtle / Moderate / Expressive
- After generation, a small "⚡ Animations ON" toggle button is embedded in the top-right corner of the generated site
- The toggle adds/removes a class `no-animations` on `<body>` which sets `animation: none !important; transition: none !important` — letting the user compare

### Animation Catalogue (by intensity)

**Subtle:**
- Buttons: `transition: transform 0.2s ease, box-shadow 0.2s ease;` on hover: `transform: translateY(-2px)`
- Cards: `transition: box-shadow 0.3s ease;` on hover: elevated shadow
- Links: underline slide-in using `::after` pseudo-element width transition

**Moderate (adds to Subtle):**
- Hero elements: fade-in + slide-up on page load using `@keyframes fadeSlideUp`
- Section headings: fade-in when section enters viewport (CSS-only: use `animation-timeline: view()` or fallback `@keyframes` with `animation-delay` staggering)
- Feature cards: staggered fade-in with `animation-delay: 0.1s, 0.2s, 0.3s`

**Expressive (adds to Moderate):**
- Hero: parallax-like background shift using CSS `transform: translateZ()` within perspective container
- Decorative elements: floating animation `@keyframes float`
- CTA buttons: subtle pulse `@keyframes pulse` on the primary button
- Page load: full reveal sequence — navbar slides down, hero fades in, subtext types in

### Prompt Layer Injected
```
SKILL — Animation Layer ({INTENSITY} intensity):
Add CSS animations and micro-interactions throughout the generated page.

Universal (all intensities):
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

Apply to all buttons:
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  cursor: pointer;
  On :hover: transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  On :active: transform: translateY(0);

Apply to all cards:
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  On :hover: transform: translateY(-4px);

{IF MODERATE OR EXPRESSIVE}:
Hero section: animation: fadeSlideUp 0.8s ease forwards;
Feature cards: animation: fadeSlideUp 0.6s ease forwards;
  card:nth-child(1) { animation-delay: 0.1s; }
  card:nth-child(2) { animation-delay: 0.2s; }
  card:nth-child(3) { animation-delay: 0.3s; }

{IF EXPRESSIVE}:
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--accent-rgb), 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(var(--accent-rgb), 0); }
}
Apply float to decorative/hero illustration elements.
Apply pulse to the primary CTA button.

Add animation toggle button fixed bottom-right:
<button onclick="document.body.classList.toggle('no-animations')" class="anim-toggle">⚡</button>
.no-animations * { animation: none !important; transition: none !important; }
```

### Visual Proof It Worked
Page loads with a visible entrance sequence. Hovering buttons shows lift effect. The ⚡ toggle button freezes all motion instantly, creating a dramatic before/after comparison — excellent for a college demo.

---

## Dark Mode Twin — Skill 06

**Tagline:** *Every site, day and night.*

### What It Does
This skill generates the site with a complete dual-theme CSS system — a light mode and a full dark mode alternative. All colors are defined as CSS custom properties, and two sets of values are provided: one for `:root` (light) and one for `[data-theme="dark"]`. A theme toggle button is embedded in the generated site's navbar.

### Frontend UI
- A toggle in the skill panel: "Generate Dark Mode Twin — ON"
- The generated site's navbar includes a 🌙/☀️ toggle button
- The preview area shows both themes — a split preview or a quick-switch button

### Prompt Layer Injected
```
SKILL — Dark Mode Twin:
Define ALL colors as CSS custom properties and provide two complete theme sets:

:root {
  /* Light Mode */
  --color-bg: {LIGHT_BG};
  --color-surface: {LIGHT_SURFACE};
  --color-text: {LIGHT_TEXT};
  --color-muted: {LIGHT_MUTED};
  --color-accent: {ACCENT};
  --color-border: {LIGHT_BORDER};
  --shadow: 0 4px 12px rgba(0,0,0,0.08);
}

[data-theme="dark"] {
  /* Dark Mode — carefully derived, not just inverted */
  --color-bg: {DARK_BG};         /* Deep dark, not pure black */
  --color-surface: {DARK_SURFACE}; /* Slightly lighter than bg for cards */
  --color-text: {DARK_TEXT};     /* Off-white, not pure white */
  --color-muted: {DARK_MUTED};
  --color-accent: {DARK_ACCENT}; /* Slightly brighter version of accent for dark bg */
  --color-border: {DARK_BORDER};
  --shadow: 0 4px 12px rgba(0,0,0,0.4);
}

Every single CSS color value must use var(--color-*) — no hardcoded hex values anywhere in the stylesheet.

Add theme toggle to navbar:
<button class="theme-toggle" aria-label="Toggle dark mode" onclick="
  const html = document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
">🌙</button>

Also add: @media (prefers-color-scheme: dark) { :root { /* same as [data-theme=dark] above */ } }
so the site respects OS-level preference by default.
```

### Visual Proof It Worked
The 🌙 toggle button switches the entire site's palette instantly — no flash, no reload. Every element (navbar, cards, text, buttons, borders, shadows) changes theme. The dark mode feels designed, not just inverted.

---

## Scroll Storyteller — Skill 08

**Tagline:** *Your site, told one scroll at a time.*

### What It Does
This skill restructures the generated site as a scroll-driven narrative experience. Each section snaps into view, reveals with a CSS entrance animation, and transitions smoothly into the next. A progress indicator on the side shows which section the user is currently on. The entire experience is orchestrated with CSS `scroll-snap` and `@keyframes` — no JavaScript.

### Frontend UI
- A toggle: "Scroll Storyteller — ON"
- After generation, the preview shows the scroll-snap experience with a section indicator on the right side (dots or a progress bar)
- A "Scroll Preview" mode in the preview panel lets the user experience it at actual size

### Prompt Layer Injected
```
SKILL — Scroll Storyteller:
Restructure the site as a scroll-snap narrative:

html, body {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

Every top-level <section> and <header>:
  scroll-snap-align: start;
  min-height: 100vh;
  display: flex;
  align-items: center;

Entrance animations — each section animates in when snapped to:
Use @keyframes with animation-fill-mode: both and a short delay:
section:nth-child(1) .content { animation: fadeSlideUp 0.6s 0.1s ease both; }
section:nth-child(2) .content { animation: fadeSlideUp 0.6s 0.1s ease both; }
(repeat for each section)

Add a scroll progress indicator — fixed right side, vertical:
<nav class="scroll-dots" aria-label="Page sections">
  One <a> dot per section, linking to section IDs (e.g. href="#hero", href="#features")
  Style: vertical column of small circles (10px), active section filled with accent color
  Use CSS :target to style the active dot — no JS required
</nav>

.scroll-dots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 12px; z-index: 100;
}
.scroll-dots a {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(0,0,0,0.2); transition: background 0.3s ease;
}
.scroll-dots a:target, .scroll-dots a:hover { background: var(--color-accent); }
```

### Visual Proof It Worked
Each section fills the viewport and snaps cleanly. The scroll dots on the right highlight the current section. The entrance animations make each section feel intentional. The experience feels like a premium product site — entirely in CSS.

---

## Component Library Drop — Skill 09

**Tagline:** *Generate a site and its design system at once.*

### What It Does
Alongside the main generated website, this skill produces a complete Component Library page — a standalone HTML file showcasing every UI element from the generated Design Style: buttons in all states, form inputs, cards, badges, alerts, typography scale, color palette swatches. This is the closest thing to a real design system deliverable, and it's entirely auto-generated.

### Frontend UI
- A toggle: "Component Library Drop — ON"
- After generation, a second tab appears in the preview area: `"Site Preview"` and `"Component Library"`
- The Component Library tab shows the standalone components page
- A "Download Component Library" button lets the user save the file

### Prompt Layer Injected
```
SKILL — Component Library Drop:
In addition to the main website, generate a SECOND complete HTML file: a Component Library.
This file must be a standalone page (can be opened directly in a browser) that documents
every UI component used in the main site, styled identically with the same Design Style.

The Component Library page must include these sections:

1. COLOR PALETTE
   Display every CSS custom property color as a swatch card: 
   colored square + variable name + hex value

2. TYPOGRAPHY SCALE
   Show every font size in use: display/h1/h2/h3/h4/body/small/caption
   Each rendered in the correct font family and weight, with the CSS values shown below

3. BUTTONS
   - Primary button (default, hover state shown via CSS)
   - Secondary / outline button
   - Ghost button
   - Disabled button (opacity: 0.5, cursor: not-allowed)
   - Small / Medium / Large size variants
   - Button with leading icon (use Unicode ← → + ✓ as icon)

4. FORM ELEMENTS
   - Text input (default, focus, error states)
   - Textarea
   - Select dropdown
   - Checkbox (checked and unchecked)
   - Radio buttons (2 options)
   - Label styles

5. CARDS
   - Basic card (shadow, border-radius, padding)
   - Card with image placeholder (top image, content below)
   - Horizontal card (image left, text right)
   - Stat card (large number, label, trend)

6. BADGES & TAGS
   - 4 badge variants (primary, success, warning, error)
   - Pill-shaped tag variants

7. ALERTS / CALLOUTS
   - Info (blue left border + ℹ️)
   - Success (green left border + ✓)
   - Warning (yellow left border + ⚠️)
   - Error (red left border + ✗)

Each component group has a clear h2 heading and is separated by a horizontal rule.
The page header shows: "[Design Style Name] Component Library — Generated by [App Name]"
```

### Visual Proof It Worked
A complete second HTML page renders in the Component Library tab — identical in style to the main site. Every button, card, badge, and form input is documented. This is a strong college presentation asset.

---

## Multilingual Layout Switcher — Skill 11

**Tagline:** *One site. Every direction.*

### What It Does
This skill generates the site with full bidirectional (BiDi) layout support — the HTML and CSS are written so that switching between LTR (left-to-right, e.g. English) and RTL (right-to-left, e.g. Arabic, Hebrew) is handled entirely by CSS using `[dir="rtl"]` selectors. A language/direction toggle is embedded in the site's navbar.

### Frontend UI
- A toggle: "Multilingual Layout Switcher — ON"
- An optional language selector appears: default language + "RTL Preview" checkbox
- After generation, the site's navbar includes a "🌐 RTL / LTR" toggle button
- The preview area shows a split: LTR on left, RTL on right (or a single toggle)

### Prompt Layer Injected
```
SKILL — Multilingual Layout Switcher:
Generate the site with full bidirectional CSS support.

HTML setup: <html lang="en" dir="ltr"> with a toggle button that switches dir attribute.

CSS rules — write all layout using logical CSS properties where possible:
Instead of: margin-left, padding-right, border-left, left: 0
Use: margin-inline-start, padding-inline-end, border-inline-start, inset-inline-start: 0

For properties that don't have logical equivalents, add RTL overrides:
[dir="rtl"] .navbar { flex-direction: row-reverse; }
[dir="rtl"] .feature-card { text-align: right; }
[dir="rtl"] .hero-content { text-align: right; }
[dir="rtl"] .sidebar { order: 1; } /* move sidebar to right */
[dir="rtl"] .icon-left { margin-left: 0; margin-right: 8px; }

Typography in RTL mode:
[dir="rtl"] body { font-family: 'Noto Sans Arabic', {ORIGINAL_FONT}, sans-serif; }
Add to Google Fonts import: 'Noto Sans Arabic'

Add toggle button to navbar:
<button 
  onclick="const h=document.documentElement; h.dir=h.dir==='rtl'?'ltr':'rtl';"
  class="dir-toggle"
  aria-label="Toggle text direction"
>🌐 RTL / LTR</button>

Test these specific layout reversal cases:
- Navbar links order reverses
- Hero text aligns to right
- Card icon + text arrangement mirrors
- Flex rows reverse direction
- Any decorative left-border elements switch to right-border
- Padding/margin feels natural in RTL
```

### Visual Proof It Worked
Clicking 🌐 in the navbar flips the entire layout — text aligns right, flex rows mirror, the sidebar moves to the opposite side. The transition happens instantly via CSS. The layout feels correct in both directions, not just mirrored awkwardly.

---

## Quick Reference Table

| # | Skill | Trigger | Output Signal | Frontend-Only? |
|---|---|---|---|---|
| 01 | Scrape & Convert | URL input field | Rebuilt site matching source structure | ✅ Yes |
| 02 | Logo to Website | Image upload + color picker | Fully branded site in logo's palette | ✅ Yes |
| 03 | SEO Skeleton Builder | Toggle + keyword input | Google SERP card + OG card at bottom of page | ✅ Yes |
| 04 | Wireframe to Website | Layout description textarea | Wireframe toggle reveals structure skeleton | ✅ Yes |
| 05 | Moodboard Matcher | Adjective tag picker (max 5) | Visually matches the feeling of selected words | ✅ Yes |
| 06 | Dark Mode Twin | Toggle | 🌙 button in navbar switches full palette | ✅ Yes |
| 07 | Responsive Wizard | Toggle + intensity | 3 device frames at bottom of preview | ✅ Yes |
| 08 | Scroll Storyteller | Toggle | Scroll-snap sections + dot nav indicator | ✅ Yes |
| 09 | Component Library Drop | Toggle | Second HTML tab — full design system doc | ✅ Yes |
| 10 | Accessibility Auditor | Toggle | A11y report panel + visible focus states | ✅ Yes |
| 11 | Multilingual Switcher | Toggle | 🌐 button flips full layout LTR↔RTL | ✅ Yes |
| 12 | Animation Layer | Toggle + intensity selector | ⚡ toggle freezes/unfreezes all animations | ✅ Yes |
