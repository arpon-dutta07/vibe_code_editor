# Design Style: Pastel Playful

Soft pastels, bubbly shapes, cheerful. Kids, lifestyle, wellness, creative brands.

## Color System

```css
:root {
  --color-pink:   #FFB3D9;
  --color-mint:   #A0E7E5;
  --color-yellow: #FFEAA7;
  --color-purple: #C3B1E1;
  --color-bg:     #FFFEF7;
  --color-text:   #4A4A4A;
  --color-muted:  #888888;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap`
- Font: `'Quicksand', sans-serif` — 400/600/700
- Headings: `font-weight: 700; letter-spacing: 0.01em;`
- Body: `font-weight: 400; line-height: 1.7;`

## Layout

- Sections each get a rotating pastel background: pink → mint → yellow → purple → bg
- Bubbly, open layout with lots of breathing room
- `border-radius: 24px` on cards

## Component Rules

- Border-radius: `24px` on cards, `999px` on buttons and tags (bubbly)
- Buttons: `border-radius: 999px; padding: 12px 32px; font-weight: 700; border: none;`
  Alternate bg between `var(--color-mint)` and `var(--color-pink)` per context
- Shadows: `box-shadow: 0 8px 20px rgba(196,177,225,0.4);`
- Optional dashed borders on some cards: `border: 2px dashed var(--color-purple);`

## Decorative Details

- Small emoji-style stars or hearts via CSS `::before` content on section headings
- Soft blobs via `border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%` shapes
- Colorful tags/pills: small spans with pastel backgrounds and rounded corners

## What to Avoid

- Dark or moody colors
- Sharp corners or hard borders
- Heavy shadows
- Corporate or monospace fonts
