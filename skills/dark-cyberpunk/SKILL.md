# Design Style: Dark Cyberpunk

Neon on black. Grid overlays. Glowing text. Terminal aesthetic.

## Color System

```css
:root {
  --color-bg:       #0a0e27;
  --color-surface:  #0d1117;
  --color-accent1:  #00d4ff;
  --color-accent2:  #ff006e;
  --color-text:     #E0E0E0;
  --color-border:   rgba(0,212,255,0.2);
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;700&display=swap`
- Headings: `'Share Tech Mono', monospace` — color `var(--color-accent1)`, text-shadow glow
- Body: `'Rajdhani', sans-serif`
- Heading glow: `color: #00d4ff; text-shadow: 0 0 10px rgba(0,212,255,0.5);`

## Layout

- Body bg: `#0a0e27` with CSS grid overlay:
  ```css
  body {
    background-color: #0a0e27;
    background-image:
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 30px 30px;
  }
  ```
- Sections: `border-top: 1px solid rgba(0,212,255,0.2);`

## Component Rules

- Buttons: `border: 2px solid #00d4ff; color: #00d4ff; background: transparent; padding: 10px 24px; font-family: 'Share Tech Mono';`
  Hover: `background: #00d4ff; color: #0a0e27;`
- Highlight tags: `background: rgba(255,0,110,0.15); color: #ff006e; padding: 2px 8px; border: 1px solid rgba(255,0,110,0.3);`
- Dividers: `1px solid rgba(0,212,255,0.2)`
- Cards: `background: #0d1117; border: 1px solid rgba(0,212,255,0.2);`

## What to Avoid

- Any light backgrounds
- Rounded pill shapes — prefer sharp or slightly rounded (4px max)
- Warm colors (orange, yellow) — only cool neon palette
- Standard sans-serif fonts — monospace is the rule
