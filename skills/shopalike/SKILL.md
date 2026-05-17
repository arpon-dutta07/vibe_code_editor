# Design Style: Shopalike

You are building a page that looks like a premium e-commerce or consumer brand site — clean, trustworthy, conversion-focused. Think Shopify storefronts, Apple product pages, modern DTC brands.

## Color System

```css
:root {
  --color-bg:        #ffffff;
  --color-surface:   #f8f8f6;
  --color-border:    #e8e8e4;
  --color-text:      #1a1a1a;
  --color-text-sub:  #6b6b6b;
  --color-accent:    #1d6f42;   /* trust green */
  --color-accent2:   #f5a623;   /* warm CTA amber */
  --color-danger:    #c0392b;
  --radius-card:     12px;
  --radius-btn:      8px;
  --shadow-card:     0 2px 12px rgba(0,0,0,0.07);
  --shadow-hover:    0 8px 32px rgba(0,0,0,0.12);
}
```

## Typography

- Headings: `'Inter'` or `'DM Sans'` (Google Fonts). Weight 700–800. Tight letter-spacing (-0.02em) for display sizes.
- Body: same family, weight 400. Line-height 1.6. Max line-length 68ch.
- Price / numbers: tabular-nums. Slightly larger than body.
- Import from Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap`

## Layout Patterns

- Hero: full-width image right, headline + CTA left. Min-height 560px. Trust badges below fold.
- Product grid: 3-column on desktop, 2 on tablet, 1 on mobile. Gap 24px.
- Section rhythm: 96px vertical padding on desktop, 64px on mobile.
- Sticky header with logo left, nav center, cart/CTA right.
- Footer: 4-column on desktop, stacked on mobile. Include trust signals (SSL, returns, support).

## Component Rules

- Buttons: filled accent (`--color-accent`) for primary CTA. Pill shape `border-radius: 9999px` OR rounded `8px`. Hover: darken 10% + slight lift (`translateY(-1px)`).
- Cards: white background, `--radius-card`, `--shadow-card`. Hover → `--shadow-hover` + `translateY(-2px)`.
- Badges / tags: small, rounded-full, light tint of accent color.
- Star ratings: `#f5a623` fill, `#e8e8e4` empty. Always show count.
- "Add to cart" button: full-width on product card, accent fill, icon left.

## Visual Rules

- Photography: lifestyle + product shots. Use `https://picsum.photos/800/600?random=N` for placeholders.
- No harsh shadows or neon. Everything feels tactile and physical.
- Use subtle grain/texture via CSS `noise` SVG filter on hero backgrounds optionally.
- Whitespace is generous. Crowded ≠ valuable.
- Trust signals throughout: lock icons, review counts, "Free returns", "In stock".

## What to avoid

- Dark backgrounds (unless a specific dark-mode section for contrast).
- Gradients with more than 2 stops.
- Comic Sans, novelty fonts, or anything that undermines trust.
- Floating elements with no clear z-context.
