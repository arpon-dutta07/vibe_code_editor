# Design Style: BoldCraft

You are building a page with strong editorial presence — massive typography, unapologetic contrast, confident white space. Think NYT Magazine, Bloomberg Businessweek, award-winning agency sites, or Pentagram work.

## Design Token System

```css
:root {
  /* Colors */
  --color-bg:       #f5f2ed;
  --color-ink:      #0d0d0d;
  --color-accent:   #d62828;
  --color-accent-2: #f4c430;
  --color-surface:  #ffffff;
  --color-text-2:   #555555;
  --color-text-3:   #888888;

  /* Spacing — 8px scale */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-6: 24px;  --space-8: 32px;
  --space-10: 40px; --space-12: 48px; --space-16: 64px;
  --space-20: 80px; --space-24: 96px; --space-32: 128px;

  /* Editorial has NO radius — everything is squared */
  --radius-sm: 0px; --radius-md: 0px; --radius-lg: 0px;

  /* Transitions */
  --t-base: 200ms ease;
  --t-slow: 350ms ease;

  /* Fonts */
  --font-display: 'Playfair Display', 'DM Serif Display', Georgia, serif;
  --font-cond:    'Barlow Condensed', 'Bebas Neue', Impact, sans-serif;
  --font-body:    'IBM Plex Sans', 'Source Serif Pro', system-ui, sans-serif;
  --font-mono:    'IBM Plex Mono', ui-monospace, monospace;
}
```

## Typography

- Fonts: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow+Condensed:wght@400;700;900&family=IBM+Plex+Sans:wght@400;500;600&display=swap`
- Hero display: `font-family: var(--font-cond); font-size: clamp(5rem, 15vw, 14rem); font-weight: 900; line-height: 0.88; letter-spacing: -0.02em; text-transform: uppercase;` — break to 1-3 words per line deliberately
- Section headline: `font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 900; line-height: 0.95;`
- Overline/label: `font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: var(--color-text-3);`
- Body: `font-family: var(--font-body); font-size: 1.05rem; line-height: 1.75; color: var(--color-text-2);`
- Pull quote: `font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2.5rem); font-style: italic; border-left: 4px solid var(--color-accent); padding-left: var(--space-6);`
- Section ordinals: `font-family: var(--font-cond); font-size: 6rem; color: #e0ddd8; font-weight: 900; line-height: 1; user-select: none;`

## Layout

- Max container: `max-width: 1200px; margin: 0 auto; padding: 0 var(--space-8);`
- Hero: left-aligned, oversized text, headline breaks every 1-3 words
- 12-column grid system: `display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-6);`
- Intentional asymmetry — columns span 7+5, 8+4, or 9+3
- Section dividers: `border-top: 3px solid var(--color-ink); padding-top: var(--space-10); margin-top: var(--space-16);`
- Sidebar: `width: 260px; border-left: 1px solid var(--color-ink); padding-left: var(--space-8);`

## Component Patterns

```css
/* Button — rectangular, uncompromising */
.btn-primary {
  background: var(--color-ink);
  color: white;
  padding: 14px 32px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid var(--color-ink);
  cursor: pointer;
  transition: background var(--t-base), color var(--t-base);
  border-radius: 0;
}
.btn-primary:hover { background: white; color: var(--color-ink); }

/* Accent button */
.btn-accent {
  background: var(--color-accent);
  color: white;
  border: 2px solid var(--color-accent);
  padding: 14px 32px;
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: background var(--t-base), color var(--t-base);
  border-radius: 0;
}
.btn-accent:hover { background: white; color: var(--color-accent); }

/* Cards — defined by border only */
.card {
  border: 1px solid var(--color-ink);
  padding: var(--space-8);
  background: var(--color-surface);
  transition: background var(--t-base);
}
.card:hover { background: var(--color-bg); }

/* Featured stat */
.stat-block {
  border-top: 3px solid var(--color-accent);
  padding-top: var(--space-4);
}
.stat-block .number {
  font-family: var(--font-cond);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 900;
  line-height: 1;
  color: var(--color-ink);
}
```

## Visual Rules

- Images: high-contrast, consider `filter: grayscale(0.3) contrast(1.1)` on hover or as base treatment
- Text on images: always ensure contrast. Use solid overlay strip if needed
- Links: `text-decoration: underline; text-underline-offset: 3px;` — hover: `background: rgba(212,40,40,0.12); text-decoration: none;`
- Accent colors used SPARINGLY — for 1-2 hero elements, never entire sections
- No rounded corners anywhere structural
- Horizontal rules carry meaning — use them deliberately
- Background: `var(--color-bg)` warm off-white — never pure white
- `:focus-visible`: `outline: 3px solid var(--color-accent); outline-offset: 2px;`

## What to avoid

- Soft pastel palettes
- Round corners on structural elements
- Drop shadows
- Centered everything (left-aligned editorial grid)
- Small timid text — this style SHOUTS
- Busy noisy backgrounds
