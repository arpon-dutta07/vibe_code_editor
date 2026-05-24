# Design Style: Warm Organic

Earthy tones, soft curves, handcrafted feel. Wellness, food, nature brands.

## Color System

```css
:root {
  --color-bg:      #FEFAE0;
  --color-surface: #FFF8EE;
  --color-surface2:#FFF3E0;
  --color-accent:  #D4845A;
  --color-green:   #6B8F71;
  --color-text:    #3D2B1F;
  --color-muted:   #7D6355;
  --color-border:  rgba(212,132,90,0.2);
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@400;600&display=swap`
- Headings: `'Lora', Georgia, serif` — warm, literary feel
- Body: `'Nunito', sans-serif`
- Heading style: `font-weight: 600; letter-spacing: 0.01em; line-height: 1.3;`

## Layout

- Sections alternate bg between `var(--color-bg)` and `var(--color-surface2)`
- Containers: `max-width: 1100px; margin: 0 auto; padding: 80px 24px;`
- Generous spacing. Organic, not rigid grid.

## Component Rules

- Border-radius: `20px` on cards, `50px` on buttons (pill shape)
- Buttons: `background: var(--color-accent); color: #FFF; border-radius: 50px; padding: 14px 32px; font-weight: 600; border: none;`
  Hover: `background: #c0734a;`
- Shadows: `box-shadow: 0 4px 20px rgba(212,132,90,0.15);`
- Image placeholders: warm-toned `background: #F5E6D3;`
- Cards: `background: var(--color-surface); border-radius: 20px; padding: 32px;`

## Visual Details

- Use CSS `clip-path: ellipse` or SVG curves between sections for wavy dividers
- Subtle leaf/nature motifs via CSS pseudo-elements where appropriate
- Never use sharp corners — every element should feel soft

## What to Avoid

- Cool blues or purples
- Sharp corners
- Monospace fonts
- Dark backgrounds
- High-contrast neon colors
