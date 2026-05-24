# Design Style: Vibrant Retro

Bold, blocky, 80s/90s-inspired. Hard shadows, oversized type, punchy colors.

## Color System

```css
:root {
  --color-red:    #FF6B6B;
  --color-yellow: #FFE66D;
  --color-teal:   #4ECDC4;
  --color-dark:   #1A1A2E;
  --color-bg:     #FFFBF0;
  --color-text:   #1A1A2E;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Righteous&family=Poppins:wght@400;700&display=swap`
- Headings: `'Righteous', cursive` — bold, retro display font
- Body: `'Poppins', sans-serif` — 400 weight
- Heading size: `clamp(2.5rem, 6vw, 5rem); font-weight: 400; text-transform: uppercase; color: var(--color-dark);`

## Layout

- Sections rotate background: `var(--color-bg)` → `var(--color-yellow)` → `var(--color-red)`
- Off-grid elements acceptable — deliberate asymmetry creates energy
- Thick section borders: `border-top: 4px solid var(--color-dark);`

## Component Rules

- Borders: `3px solid #1A1A2E` on cards and buttons
- Hard offset shadow (no blur): `box-shadow: 4px 4px 0px #1A1A2E`
- Buttons: `background: var(--color-teal); border: 3px solid #1A1A2E; box-shadow: 4px 4px 0 #1A1A2E; border-radius: 0; font-weight: 700; text-transform: uppercase; padding: 12px 28px;`
  Hover: `transform: translate(3px, 3px); box-shadow: 2px 2px 0 #1A1A2E;`
- Cards: white bg, `border: 3px solid #1A1A2E; box-shadow: 6px 6px 0 #1A1A2E; border-radius: 0;`

## Decorative Details

- CSS pseudo-elements for geometric shapes (filled circles, squares) in corner accents
- Striped background on hero sections using CSS repeating-linear-gradient
- Star/burst shapes via CSS clip-path on badges

## What to Avoid

- Soft gradients or glassmorphism
- Subtle or muted color palettes
- Thin fonts or fine lines
- Rounded corners (max 4px if needed)
