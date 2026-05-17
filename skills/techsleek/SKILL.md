# Design Style: TechSleek

You are building a page that looks like it could be from Vercel, Linear, Stripe, or Clerk — clean, opinionated, developer-trusted. Sharp edges where needed, confident typography, zero decoration for decoration's sake.

## Color System

```css
:root {
  --color-bg:        #fafafa;
  --color-surface:   #ffffff;
  --color-surface2:  #f4f4f5;
  --color-border:    #e4e4e7;
  --color-text:      #09090b;
  --color-text-sub:  #71717a;
  --color-text-muted:#a1a1aa;
  --color-accent:    #18181b;   /* near-black primary */
  --color-accent2:   #3b82f6;   /* electric blue for links/highlights */
  --color-success:   #22c55e;
  --color-danger:    #ef4444;
  --radius-card:     8px;
  --radius-btn:      6px;
  --shadow-sm:       0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
}
```

## Typography

- All text: `'Inter'` (Google Fonts). The king of product UI fonts.
- Display headings: `font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.1;`
- Subheadings: `font-weight: 600; letter-spacing: -0.02em;`
- Body: `font-size: 1rem; line-height: 1.7; color: var(--color-text-sub);`
- Code/mono snippets: `'JetBrains Mono'` or `'Fira Code'`, 0.85em, `--color-surface2` background.
- Import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`

## Layout Patterns

- Hero: centered text-first. Large headline, 1-line subtext, 2-button CTA row (primary filled, secondary ghost).
- Max content width: `1120px`. Centered. Sections: `padding: 96px 0`.
- Feature grid: 3-column cards on desktop. Each card: icon top-left, heading, 2-line description. Border, radius, no heavy shadow.
- Comparison table or feature checklist sections work well.
- Social proof strip: logos of recognizable brands/companies in a horizontal scroll.

## Component Rules

- Primary button: `background: var(--color-accent); color: white; border-radius: var(--radius-btn); padding: 10px 20px; font-weight: 500; font-size: 0.9rem;`
  Hover: `background: #27272a; box-shadow: var(--shadow-sm);`
- Secondary button: `border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text);`
- Cards: clean white, `--shadow-sm`, `--radius-card`. On hover: `border-color: #a1a1aa`.
- Code blocks: dark (`#09090b`), monospace, rounded, copy-button top-right.
- Badges: `border-radius: 9999px; padding: 2px 10px; font-size: 0.7rem; font-weight: 600;` — often used for "New", "Beta", "Open Source".

## Visual Rules

- Icons: Lucide or Heroicons. Stroke-based, 20px, `--color-text-sub` color.
- No decorative images in hero — use code snippets, terminal windows, or abstract grid art.
- Dividers: `1px solid var(--color-border)`.
- Gradients: only very subtle, like `linear-gradient(to bottom, white, var(--color-surface2))` for section transitions.
- Contrast: everything should be WCAG AA. No light-grey text on light-grey backgrounds.

## What to avoid

- Drop shadows that look like they're from 2010.
- Rounded pill buttons everywhere (one or two is fine, not all).
- Gradient text (unless used very sparingly for a single accent word).
- Stock photography of people in offices.
- Any color that feels "startup fun" (avoid coral, bubblegum pink, neon green unless accent-only).
