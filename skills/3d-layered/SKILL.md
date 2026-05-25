# Design Style: Warm Earth

Creamy canvas, terracotta and olive accents, organic shapes. Ceramics, artisan food, wellness brands, eco-conscious products.

## Color System

```css
:root {
  --color-bg:         #FAF5EF;
  --color-surface:    #FFFFFF;
  --color-terracotta: #C4653A;
  --color-olive:      #6B7D3A;
  --color-clay:       #D4A574;
  --color-text:       #3D2E1F;
  --color-muted:      #9C8B7A;
  --color-border:     rgba(196,101,58,0.15);
  --color-sand:       #E8DDD0;
  --color-cream:      #FDF8F2;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Source+Sans+3:wght@300;400;500;600&display=swap`
- Headings: `'DM Serif Display', Georgia, serif` — warm, grounded, occasionally italic
- Body: `'Source Sans 3', 'Helvetica Neue', sans-serif`
- Heading style: `color: var(--color-text); font-weight: 400; letter-spacing: -0.01em;`
- Body: `font-size: 1.05rem; line-height: 1.85; color: var(--color-text); font-weight: 300;`
- Caption style: `color: var(--color-muted); font-size: 0.85rem; font-weight: 400; letter-spacing: 0.04em; text-transform: uppercase;`

## Layout

- Body bg: `#FAF5EF` — warm parchment
- Section padding: `96px 0` — generous breathing room
- Containers: `max-width: 960px` — narrow for intimate reading
- Image treatment: `border-radius: 12px; overflow: hidden;` — soft organic frames

## Component Rules

- Dividers: `border-top: 1px solid var(--color-sand)`
- Organic accent before section titles:
  ```css
  .section-title::before {
    content: '';
    display: block;
    width: 32px;
    height: 3px;
    background: var(--color-terracotta);
    border-radius: 2px;
    margin-bottom: 14px;
  }
  ```
- Buttons: `background: var(--color-terracotta); color: #FFFFFF; border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 500; padding: 14px 32px; letter-spacing: 0.02em;`
  Hover: `background: #A8522E; transform: translateY(-1px);`
- Secondary buttons: `background: transparent; border: 1.5px solid var(--color-terracotta); color: var(--color-terracotta); border-radius: 8px;`
  Hover: `background: rgba(196,101,58,0.06);`
- Cards: `background: var(--color-surface); border: 1px solid var(--color-sand); border-radius: 12px; padding: 36px; box-shadow: 0 2px 12px rgba(61,46,31,0.04);`
- Inputs: `background: var(--color-cream); border: 1.5px solid var(--color-sand); border-radius: 8px; padding: 14px 18px; color: var(--color-text);`
  Focus: `border-color: var(--color-terracotta); box-shadow: 0 0 0 3px rgba(196,101,58,0.1);`
- Tags: `background: rgba(107,125,58,0.1); color: var(--color-olive); border-radius: 20px; padding: 5px 14px; font-size: 0.8rem; font-weight: 500;`

## What to Avoid

- Cool blues, pure whites, neon colors
- Sharp 0px corners — everything should feel soft
- Monospace or condensed fonts
- Dark mode — this style lives in warmth
- Heavy drop shadows
- Geometric rigidity — let layouts breathe unevenly