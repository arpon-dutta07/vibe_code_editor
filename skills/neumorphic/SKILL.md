# Design Style: Neumorphic

Soft 3D extruded surfaces on a uniform grey background. Tactile, minimal.

## Color System

```css
:root {
  --color-bg:      #E0E5EC;
  --color-surface: #E0E5EC;
  --color-accent:  #6C63FF;
  --color-text:    #4A4A6A;
  --color-muted:   #8A8AAA;
  --shadow-light:  #ffffff;
  --shadow-dark:   #b8bec7;
}
```

**CRITICAL: Every background must be `#E0E5EC`. Neumorphic shadows only work on a uniform background.**

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap`
- Font: `'Poppins', sans-serif` — 300/400/600 weights
- Headings: `font-weight: 600; color: var(--color-text);`
- Body: `font-weight: 400; color: var(--color-muted);`

## Neumorphic Shadow Patterns

```css
/* Raised element (card, button) */
.raised {
  background: #E0E5EC;
  box-shadow: 6px 6px 12px #b8bec7, -6px -6px 12px #ffffff;
  border-radius: 16px;
  border: none;
}

/* Pressed/active element */
.pressed {
  background: #E0E5EC;
  box-shadow: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff;
}

/* Input field */
.input-field {
  background: #E0E5EC;
  box-shadow: inset 2px 2px 5px #b8bec7, inset -2px -2px 5px #ffffff;
  border: none;
}
```

## Component Rules

- All cards: use `.raised` pattern above
- Buttons at rest: `.raised` pattern; on click/active: `.pressed` pattern
- Form inputs: always `.input-field` pattern
- Accent color `#6C63FF`: ONLY for text highlights, icons, and active states — never as background fill
- Never use colored backgrounds on cards or sections

## What to Avoid

- Any background color other than `#E0E5EC` for the neumorphic surfaces
- Colored card backgrounds
- Gradients (except very subtle on accent-only elements)
- High contrast — everything should feel like it emerges from the same surface
