# Design Style: Arctic Frost

Icy white canvas, steel blue accents, ultra-clean geometry. SaaS platforms, fintech, analytics tools, Scandinavian-inspired products.

## Color System

```css
:root {
  --color-bg:         #F7F9FC;
  --color-surface:    #FFFFFF;
  --color-surface-alt:#EDF1F7;
  --color-steel:      #3B6B9E;
  --color-ice:        #6BA3D6;
  --color-frost:      #A8CBE8;
  --color-text:       #1A2B3C;
  --color-muted:      #7A8DA0;
  --color-border:     #DCE3ED;
  --color-accent:     #2E5C8A;
  --color-success:    #2D8A5E;
  --color-danger:     #C43D3D;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap`
- Headings: `'Inter', -apple-system, sans-serif` — clean, precise, no-nonsense
- Body: `'Inter', -apple-system, sans-serif`
- Mono: `'IBM Plex Mono', monospace` — for data, stats, code
- Heading style: `color: var(--color-text); font-weight: 600; letter-spacing: -0.02em;`
- Body: `font-size: 0.95rem; line-height: 1.7; color: var(--color-text); font-weight: 400;`
- Data numbers: `font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-variant-numeric: tabular-nums;`

## Layout

- Body bg: `#F7F9FC` — cool snow white with a blue cast
- Section padding: `64px 0` — efficient, not wasteful
- Containers: `max-width: 1280px` — wider for data-rich layouts
- Grid: 12-column with `16px` gutters
- Sidebar-aware: accommodate fixed 240px left nav

## Component Rules

- Dividers: `border-top: 1px solid var(--color-border)`
- Section label style:
  ```css
  .section-label {
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-size: 0.72rem;
    font-weight: 600;
    margin-bottom: 8px;
  }
  ```
- Buttons: `background: var(--color-steel); color: #FFFFFF; border: none; border-radius: 6px; font-size: 0.85rem; font-weight: 500; padding: 10px 20px;`
  Hover: `background: var(--color-accent); box-shadow: 0 1px 3px rgba(59,107,158,0.2);`
- Secondary buttons: `background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text); border-radius: 6px;`
  Hover: `background: var(--color-surface-alt); border-color: var(--color-steel);`
- Cards: `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 24px; box-shadow: 0 1px 3px rgba(26,43,60,0.04);`
- Stat cards: `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 20px 24px;` with a `3px solid var(--color-steel)` left border accent
- Inputs: `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 6px; padding: 10px 14px; font-size: 0.9rem;`
  Focus: `border-color: var(--color-steel); box-shadow: 0 0 0 3px rgba(59,107,158,0.12);`
- Tables: `border-collapse: collapse;` with `border-bottom: 1px solid var(--color-border)` rows. Header: `background: var(--color-surface-alt); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600; color: var(--color-muted);`
- Badges: `background: var(--color-surface-alt); color: var(--color-steel); border-radius: 4px; padding: 3px 8px; font-size: 0.75rem; font-weight: 500;`

## What to Avoid

- Warm tones (terracotta, gold, orange)
- Serif or decorative fonts
- Border radius above 12px
- Dark mode — this is a light-mode-first system
- Ornamental flourishes or illustrations
- Low-contrast text — maintain WCAG AA minimum

