# Design Style: Corporate Professional

Trust-first. Navy, white, structured grid. Enterprise, finance, consulting.

## Color System

```css
:root {
  --color-bg:      #F7F9FC;
  --color-navy:    #1a3a52;
  --color-accent:  #2E86AB;
  --color-text:    #2D3748;
  --color-muted:   #718096;
  --color-border:  #E2E8F0;
  --color-surface: #FFFFFF;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Source+Sans+3:wght@400;600&display=swap`
- Headings: `'Merriweather', Georgia, serif` — authoritative, professional
- Body: `'Source Sans 3', system-ui, sans-serif`
- Heading color: `var(--color-navy); font-weight: 700;`
- Body: `font-size: 1rem; line-height: 1.7; color: var(--color-text);`

## Layout

- Max-width: `1140px` — structured, feels like a 12-column grid
- Header/navbar: `background: var(--color-navy); color: white; height: 64px;`
- Sections: alternating white and `var(--color-bg)`
- Padding: `96px 0` for major sections

## Component Rules

- Buttons: `background: var(--color-accent); border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;`
  — sharp, not pill-shaped
- Cards: `background: white; border: 1px solid var(--color-border); border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);`
- Tables: striped rows — odd rows `white`, even rows `var(--color-bg)`; header row `var(--color-navy)` with white text
- Badges: small, uppercase, `border-radius: 4px`, navy or accent bg

## What to Avoid

- Playful fonts or rounded pill shapes everywhere
- Gradients (except very subtle)
- Bright or saturated accent colors beyond the palette
- Casual or informal visual language
