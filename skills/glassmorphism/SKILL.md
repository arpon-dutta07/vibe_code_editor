# Design Style: Glassmorphism

Frosted glass panels on dark gradient backgrounds. Premium, modern, depth-driven.

## Color System

```css
:root {
  --color-bg-start:  #1a1a2e;
  --color-bg-mid:    #16213e;
  --color-bg-end:    #0f3460;
  --color-text:      #FFFFFF;
  --color-muted:     rgba(255,255,255,0.65);
  --color-accent:    #7B61FF;
  --color-accent2:   #E0AAFF;
  --color-glass-bg:  rgba(255,255,255,0.08);
  --color-glass-border: rgba(255,255,255,0.15);
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&display=swap`
- Font: `'Nunito', sans-serif` — 400/600/800 weights
- Headings: `font-weight: 800; letter-spacing: -0.02em;`

## Layout

- Body background: `background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%); min-height: 100vh;`
- All cards and panels use the glass card style below
- `border-radius: 16px` on cards, `8px` on buttons

## Glass Card Pattern

```css
.glass-card {
  background: rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}
```

Every section container, card, and panel must use this glass style.

## Component Rules

- Buttons: `background: linear-gradient(135deg, #7B61FF, #E0AAFF); border-radius: 8px; color: #fff; border: none;`
- Text colors: headings `#FFFFFF`, body `rgba(255,255,255,0.65)`
- Icons: use light-colored SVG or Unicode, never dark icons

## What to Avoid

- White or light backgrounds
- Flat opaque cards
- Heavy borders
- Any non-glass surface treatment
