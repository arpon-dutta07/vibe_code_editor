# Design Style: Flat Modern

Zero shadows. Bold color blocks. DM Sans. Typography-driven hierarchy.

## Color System

```css
:root {
  --color-bg:     #F0F4F8;
  --color-blue:   #3D5A80;
  --color-coral:  #EE6C4D;
  --color-navy:   #293241;
  --color-light:  #E0FBF8;
  --color-text:   #293241;
  --color-muted:  #5F7080;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap`
- Font: `'DM Sans', system-ui, sans-serif` — 400/500/700
- Headings: `font-weight: 700; letter-spacing: -0.01em;`
- Hierarchy via size and weight ONLY — no decorative typographic elements

## Layout

- Sections use bold background color blocks for visual separation: `var(--color-blue)`, `var(--color-coral)`, `var(--color-bg)`
- White text on colored sections, dark text on light sections
- Containers: `max-width: 1140px; margin: 0 auto; padding: 80px 24px;`

## Component Rules

**CRITICAL RULE: No box-shadow, no border-radius above 8px, no gradients — completely flat.**

- Buttons: flat solid fill, `border-radius: 4px; border: none; font-weight: 700;`
  Hover: color change only — no movement, no shadow
- Cards: `background: white; border-radius: 4px; padding: 32px;` — no shadow, no border
- Icons: simple Unicode symbols or minimal flat SVG — single-color
- Dividers: solid colored bands (full-width section blocks), not lines

## What to Avoid

- Drop shadows of any kind
- Border-radius above 8px
- Gradients (strictly forbidden)
- Decorative elements beyond color and typography
