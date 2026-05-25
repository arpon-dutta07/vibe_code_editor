# Design Style: Shopalike

You are building a premium e-commerce or consumer brand site — clean, trustworthy, conversion-focused. Think Shopify storefronts, Apple product pages, or modern DTC brands.

## Design Token System

```css
:root {
  /* Colors */
  --color-bg:       #ffffff;
  --color-surface:  #f8f8f6;
  --color-surface-2:#f0f0ec;
  --color-border:   #e8e8e4;
  --color-border-2: #d0d0cc;
  --color-text:     #1a1a1a;
  --color-text-2:   #444444;
  --color-text-3:   #6b6b6b;
  --color-text-4:   #999999;
  --color-accent:   #1d6f42;
  --color-cta:      #f5a623;
  --color-cta-2:    #e08c0f;
  --color-danger:   #c0392b;
  --color-success:  #27ae60;

  /* Spacing — 8px scale */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-5: 20px;  --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px; --space-24: 96px;

  /* Radius */
  --radius-sm: 4px;  --radius-md: 8px;
  --radius-lg: 12px; --radius-xl: 16px; --radius-pill: 9999px;

  /* Multi-layer shadows */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
  --shadow-product: 0 8px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);

  /* Transitions */
  --t-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --t-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Fonts */
  --font-sans: 'Inter', 'DM Sans', system-ui, sans-serif;
}
```

## Typography

- Font: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap`
- Hero headline: `font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; color: var(--color-text);`
- Product title: `font-size: 1.25rem; font-weight: 700; letter-spacing: -0.01em;`
- Price: `font-size: 1.75rem; font-weight: 700; font-variant-numeric: tabular-nums; color: var(--color-text);`
- Original price: `text-decoration: line-through; color: var(--color-text-3); font-size: 1.1rem;`
- Body: `font-size: 0.95rem; line-height: 1.7; color: var(--color-text-3); max-width: 68ch;`

## Layout

- Max container: `max-width: 1200px; margin: 0 auto; padding: 0 var(--space-6);`
- Hero: image right (50% width), headline + subtext + trust badges + CTA left. Min-height 560px.
- Product grid: `display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: var(--space-6);`
- Section padding: `var(--space-24) 0`
- Sticky nav: `position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid var(--color-border);`

## Component Patterns

```css
/* Primary CTA button */
.btn-cta {
  background: var(--color-cta);
  color: white;
  border-radius: var(--radius-md);
  padding: 14px 32px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: background var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
}
.btn-cta:hover { background: var(--color-cta-2); transform: translateY(-1px); box-shadow: var(--shadow-md); }

/* Add to cart */
.btn-cart {
  background: var(--color-accent);
  color: white;
  border-radius: var(--radius-md);
  padding: 12px 24px;
  font-weight: 600;
  width: 100%;
  border: none;
  cursor: pointer;
  transition: background var(--t-fast), transform var(--t-fast);
}
.btn-cart:hover { background: #155a33; transform: translateY(-1px); }

/* Product card */
.product-card {
  background: var(--color-bg);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--t-base), transform var(--t-base);
}
.product-card:hover { box-shadow: var(--shadow-product); transform: translateY(-4px); }

.product-image {
  width: 100%;
  aspect-ratio: 4/3;
  object-fit: cover;
  background: var(--color-surface-2);
}

/* Star rating */
.stars {
  color: var(--color-cta);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}
.rating-count { color: var(--color-text-3); font-size: 0.8rem; margin-left: 6px; }

/* Trust badge */
.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-text-3);
  font-weight: 500;
}
```

## Visual Rules

- Photography: lifestyle + product shots. Use `https://picsum.photos/seed/{keyword}/800/600` for placeholders.
- Images have `aspect-ratio: 4/3` or `aspect-ratio: 1` consistently — never uncontrolled height
- Trust signals visible throughout: lock icons, "Free returns", star reviews, "In stock" badges
- Sale badge: `background: var(--color-danger); color: white; border-radius: var(--radius-sm); padding: 2px 8px; font-size: 0.7rem; font-weight: 700;`
- "New" badge: `background: var(--color-accent); color: white;` — same sizing
- Sticky header on scroll: use `backdrop-filter: blur(8px)`
- `:focus-visible`: `outline: 2px solid var(--color-accent); outline-offset: 2px;`

## What to avoid

- Dark heavy backgrounds
- More than 2-stop gradients
- Novelty/script fonts
- Cluttered layouts — conversion comes from clarity
- Any element that reduces trust perception
