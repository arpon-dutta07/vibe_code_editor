# Design Style: TechSleek

You are building a page that looks like it could be from Vercel, Linear, Stripe, or Clerk — clean, opinionated, developer-trusted. Sharp edges where needed, confident typography, zero decoration for decoration's sake.

## Design Token System

```css
:root {
  /* Colors */
  --color-bg:          #fafafa;
  --color-surface:     #ffffff;
  --color-surface-2:   #f4f4f5;
  --color-surface-3:   #e4e4e7;
  --color-border:      #e4e4e7;
  --color-border-2:    #d4d4d8;
  --color-text:        #09090b;
  --color-text-2:      #3f3f46;
  --color-text-3:      #71717a;
  --color-text-4:      #a1a1aa;
  --color-accent:      #18181b;
  --color-accent-blue: #2563eb;
  --color-success:     #16a34a;
  --color-danger:      #dc2626;
  --color-warning:     #d97706;

  /* Spacing — 8px scale */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;
  --space-4: 16px;  --space-5: 20px;  --space-6: 24px;
  --space-8: 32px;  --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Radius */
  --radius-sm: 4px;  --radius-md: 6px;
  --radius-lg: 8px;  --radius-xl: 12px;

  /* Elevation shadows (multi-layer) */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);

  /* Transitions */
  --t-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1);
  --t-base:   200ms cubic-bezier(0.4, 0, 0.2, 1);
  --t-slow:   300ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}
```

## Typography

- Font: `'Inter'` — `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`
- Display: `font-size: clamp(2.5rem, 5vw, 4.5rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.05;`
- H2: `font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.15;`
- H3: `font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em;`
- Body: `font-size: 1rem; line-height: 1.75; color: var(--color-text-3);`
- Small: `font-size: 0.875rem; color: var(--color-text-4);`
- Code: `font-family: var(--font-mono); font-size: 0.85em; background: var(--color-surface-2); padding: 2px 6px; border-radius: var(--radius-sm);`

## Layout

- Max container: `max-width: 1120px; margin: 0 auto; padding: 0 var(--space-6);`
- Section padding: `padding: var(--space-24) 0;`
- Hero: centered text. Headline → one-line badge above it (`background: var(--color-surface-2); border-radius: 9999px; padding: 4px 12px; font-size: 0.75rem; font-weight: 500`) → headline → subtext → 2-button CTA row.
- Feature grid: 3-column CSS Grid. Gap: `var(--space-6)`. Each card: icon top-left (24px, Lucide), heading, 2-line description.
- Bento option: `grid-template-columns: repeat(3, 1fr)` with some items spanning 2 cols (`grid-column: span 2`).

## Component Patterns

```css
/* Primary button */
.btn-primary {
  background: var(--color-accent);
  color: white;
  border-radius: var(--radius-md);
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.btn-primary:hover { background: #27272a; box-shadow: var(--shadow-md); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0); }

/* Secondary button */
.btn-secondary {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 9px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
}
.btn-secondary:hover { border-color: var(--color-border-2); box-shadow: var(--shadow-sm); }

/* Card */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--t-base), box-shadow var(--t-base);
}
.card:hover { border-color: var(--color-text-4); box-shadow: var(--shadow-md); }

/* Badge */
.badge {
  display: inline-flex; align-items: center;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-3);
}
```

## Visual Rules

- No heavy decoration — let space do the work
- Dividers: `1px solid var(--color-border)`
- Section transitions: subtle `linear-gradient(to bottom, var(--color-bg), var(--color-surface-2))`
- Icons: Lucide, 20px, `var(--color-text-3)`, stroke-width 1.5
- Code blocks: `background: #09090b; color: #f4f4f5; font-family: var(--font-mono); border-radius: var(--radius-lg); padding: var(--space-6);`
- Images use `aspect-ratio: 16/9` or `aspect-ratio: 1` — never unconstrained
- Contrast: all text passes WCAG AA (4.5:1 minimum)
- `:focus-visible` outline: `2px solid var(--color-accent-blue); outline-offset: 2px;`

## What to avoid

- Drop shadows from 2015 (use the elevation system above)
- Pill buttons everywhere
- Gradient text on body text
- Stock office photos
- Any hardcoded hex values — use tokens
