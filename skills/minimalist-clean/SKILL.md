# Design Style: Minimalist Clean

Clean whitespace, Inter font, flat accent. Think Apple, Notion, Linear.

## Color System

```css
:root {
  --color-bg:      #FFFFFF;
  --color-text:    #111111;
  --color-accent:  #007AFF;
  --color-muted:   #6B7280;
  --color-border:  #E5E7EB;
  --color-surface: #F3F4F6;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@700&display=swap`
- Body font: `'Inter', system-ui, sans-serif`
- Headings (h1/h2): `'Poppins', 700 weight`
- Heading size: `clamp(2rem, 5vw, 3.5rem); font-weight: 700; letter-spacing: -0.02em;`
- Body: `font-size: 1rem; line-height: 1.7; color: var(--color-muted);`
- Rule: max 2 font sizes per section

## Layout & Spacing

- Base unit 8px. Sections: `padding: 80px 0`. Containers: `max-width: 1100px; margin: 0 auto;`
- Generous whitespace. Never crowd elements.
- CSS Grid for page layout. Flexbox for component alignment.
- Mobile-first with responsive breakpoints.

## Component Rules

- Borders: thin `1px solid var(--color-border)` only — no decorative borders
- Shadows: none or `box-shadow: 0 1px 3px rgba(0,0,0,0.06)` max
- Buttons: flat solid accent, `border-radius: 6px; padding: 12px 28px; font-weight: 500;`
- Images/placeholders: `background: var(--color-surface)` divs with aspect-ratio
- Cards: white bg, `border: 1px solid var(--color-border); border-radius: 8px;`

## What to Avoid

- Gradients (except very subtle bg)
- Heavy drop shadows
- Decorative borders or dividers
- Crowded layouts — whitespace is the design
- More than 2 accent colors
