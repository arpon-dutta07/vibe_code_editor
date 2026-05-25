# Design Style: WarmEarth

You are building a page that feels human, grounded, and approachable — like a wellness brand, artisan shop, or mindful SaaS. Think Notion, Calm, Curology, or a well-crafted Substack publication.

## Design Token System

```css
:root {
  /* Colors */
  --color-bg:       #fdf8f3;
  --color-surface:  #ffffff;
  --color-surface-2:#f5ede1;
  --color-surface-3:#eee4d7;
  --color-border:   #e8ddd0;
  --color-border-2: #d4c4b4;
  --color-text:     #2c2018;
  --color-text-2:   #5a4638;
  --color-text-3:   #7c6a5e;
  --color-text-4:   #a89082;
  --color-accent:   #c47c4a;
  --color-accent-2: #6b8f71;
  --color-accent-3: #9b7bb8;

  /* Spacing — 8px scale */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Radius — round and approachable */
  --radius-sm: 8px;  --radius-md: 12px;
  --radius-lg: 16px; --radius-xl: 24px; --radius-pill: 9999px;

  /* Warm multi-layer shadows */
  --shadow-xs: 0 1px 3px rgba(80,40,20,0.06);
  --shadow-sm: 0 2px 8px rgba(80,40,20,0.08), 0 1px 3px rgba(80,40,20,0.04);
  --shadow-md: 0 8px 24px rgba(80,40,20,0.1), 0 2px 8px rgba(80,40,20,0.05);
  --shadow-lg: 0 16px 40px rgba(80,40,20,0.12), 0 4px 12px rgba(80,40,20,0.06);

  /* Transitions */
  --t-fast: 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
  --t-base: 250ms ease;
  --t-slow: 400ms ease;

  /* Fonts */
  --font-heading: 'Lora', 'Crimson Pro', Georgia, serif;
  --font-body: 'Nunito', 'DM Sans', system-ui, sans-serif;
}
```

## Typography

- Fonts: `https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@400;500;600;700&display=swap`
- Display: `font-family: var(--font-heading); font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 700; line-height: 1.18; letter-spacing: -0.01em; color: var(--color-text);`
- Accent word in heading: `color: var(--color-accent); font-style: italic;`
- H2: `font-family: var(--font-heading); font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 600;`
- Body: `font-family: var(--font-body); font-size: 1rem; line-height: 1.8; color: var(--color-text-3);`
- Large quote: `font-family: var(--font-heading); font-size: clamp(1.2rem, 2.5vw, 1.75rem); font-style: italic;`

## Layout

- Max container: `max-width: 1100px; margin: 0 auto; padding: 0 var(--space-6);`
- Section padding: `var(--space-24) 0`
- Alternate sections between `var(--color-bg)` and `var(--color-surface-2)` for rhythm
- Hero: centered, warm illustration placeholder, badge above headline, subtext with rounded highlight
- Staggered feature rows: image-text alternating (flip each row)

## Component Patterns

```css
/* Primary button */
.btn-primary {
  background: var(--color-accent);
  color: white;
  border-radius: var(--radius-pill);
  padding: 14px 32px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.95rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.btn-primary:hover { background: #a86640; transform: scale(1.02); box-shadow: var(--shadow-md); }

/* Secondary button */
.btn-secondary {
  background: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-pill);
  padding: 12px 30px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background var(--t-base);
}
.btn-secondary:hover { background: rgba(196,124,74,0.08); }

/* Card */
.card {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  padding: var(--space-8);
  transition: box-shadow var(--t-base), transform var(--t-base);
}
.card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }

/* Testimonial */
.testimonial {
  background: var(--color-surface-2);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  border-left: 4px solid var(--color-accent);
}
.testimonial::before {
  content: '"';
  font-family: var(--font-heading);
  font-size: 5rem;
  color: var(--color-accent);
  opacity: 0.3;
  line-height: 0.7;
  display: block;
  margin-bottom: var(--space-4);
}
```

## Organic Decorative Shapes

```css
/* Warm blob shape — use as section background accent */
.blob {
  position: absolute;
  border-radius: 70% 30% 60% 40% / 50% 60% 40% 50%;
  background: var(--color-accent);
  opacity: 0.07;
  pointer-events: none;
  filter: blur(40px);
}
```

## Visual Rules

- Tags: `border-radius: var(--radius-pill); background: rgba(107,143,113,0.12); color: var(--color-accent-2); font-size: 0.8rem; padding: 4px 12px;`
- Avatars: `border-radius: 50%; border: 3px solid var(--color-surface-2);`
- Icon style: Lucide, 20px, rounded stroke, terracotta or sage color
- Dividers: `border: none; height: 1px; background: linear-gradient(to right, transparent, var(--color-border), transparent);`
- Section numbers: `font-family: var(--font-heading); font-size: 5rem; color: var(--color-border-2); font-weight: 700; line-height: 1;`
- `:focus-visible`: `outline: 2px solid var(--color-accent); outline-offset: 2px; border-radius: var(--radius-sm);`

## What to avoid

- Cold blues or tech greys
- Sharp hard corners on cards
- Pure black or pure white backgrounds
- Busy layouts — breathing room is a feature
- Small or timid text
