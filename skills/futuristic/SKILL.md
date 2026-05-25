# Design Style: Futuristic

You are building a page that feels like it belongs to a cutting-edge tech startup in 2040 — sci-fi precision, holographic depth, neon accents in surgical doses. Think SpaceX, Cyberpunk interfaces, or NASA mission control.

## Design Token System

```css
:root {
  /* Background */
  --color-bg:       #050810;
  --color-surface:  #0c1120;
  --color-surface-2:#111827;
  --color-surface-3:#1a2235;

  /* Neon accents */
  --color-neon:     #00ffc8;
  --color-neon-dim: rgba(0,255,200,0.15);
  --color-neon-glow:rgba(0,255,200,0.3);
  --color-violet:   #7c3aed;
  --color-magenta:  #f0abfc;

  /* Text */
  --color-text:     #e8f4ff;
  --color-text-2:   #90a8c0;
  --color-text-3:   #607080;

  /* Borders */
  --color-border:   rgba(0,255,200,0.12);
  --color-border-2: rgba(0,255,200,0.3);

  /* Spacing — 8px scale */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-6: 24px;  --space-8: 32px;
  --space-10: 40px; --space-12: 48px; --space-16: 64px;
  --space-20: 80px; --space-24: 96px;

  /* Radius — minimal/sharp */
  --radius-sm: 2px; --radius-md: 4px; --radius-lg: 6px;

  /* Shadows — neon glow system */
  --shadow-neon-sm: 0 0 8px var(--color-neon-glow);
  --shadow-neon-md: 0 0 20px var(--color-neon-glow), 0 0 40px rgba(0,255,200,0.1);
  --shadow-neon-lg: 0 0 30px var(--color-neon-glow), 0 0 60px rgba(0,255,200,0.15), 0 0 100px rgba(0,255,200,0.05);
  --shadow-card:    0 4px 20px rgba(0,0,0,0.6), inset 0 1px 0 var(--color-neon-dim);

  /* Transitions */
  --t-fast: 120ms ease;
  --t-base: 220ms ease;

  /* Fonts */
  --font-display: 'Orbitron', 'Space Grotesk', system-ui, sans-serif;
  --font-mono:    'Share Tech Mono', 'JetBrains Mono', ui-monospace, monospace;
  --font-body:    'Inter', system-ui, sans-serif;
}
```

## Typography

- Fonts: `https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Space+Grotesk:wght@400;500;700&display=swap`
- Display: `font-family: var(--font-display); font-size: clamp(2.8rem, 7vw, 7rem); font-weight: 900; letter-spacing: 0.04em; text-transform: uppercase; line-height: 1.0;`
- Neon glow text: `text-shadow: 0 0 20px var(--color-neon), 0 0 50px rgba(0,255,200,0.3); color: var(--color-neon);`
- H2: `font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;`
- Body: `font-family: var(--font-body); font-size: 0.95rem; line-height: 1.75; color: var(--color-text-2);`
- Labels/tags: `font-family: var(--font-mono); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--color-neon);`
- Stats: `font-family: var(--font-mono); font-size: clamp(2rem, 5vw, 4rem); color: var(--color-neon); font-weight: 400;`

## Background Texture

```css
body {
  background-color: var(--color-bg);
  background-image:
    linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
```

## Component Patterns

```css
/* Button */
.btn-primary {
  background: transparent;
  color: var(--color-neon);
  border: 1px solid var(--color-neon);
  border-radius: var(--radius-md);
  padding: 12px 28px;
  font-family: var(--font-display);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background var(--t-base), box-shadow var(--t-base), color var(--t-base);
}
.btn-primary:hover {
  background: var(--color-neon);
  color: var(--color-bg);
  box-shadow: var(--shadow-neon-md);
}

/* Card */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-card);
  transition: border-color var(--t-base), box-shadow var(--t-base);
  position: relative;
}
.card:hover {
  border-color: var(--color-border-2);
  box-shadow: var(--shadow-neon-sm), var(--shadow-card);
}
/* Neon top border on hover */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-neon), transparent);
  opacity: 0;
  transition: opacity var(--t-base);
}
.card:hover::before { opacity: 1; }
```

## Scanline Animation

```css
@keyframes scanline {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
/* Add a scanline overlay to the hero:
   <div class="scanline"></div> */
.scanline {
  position: absolute;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(0,255,200,0.06), transparent);
  animation: scanline 8s linear infinite;
  pointer-events: none;
}
```

## Visual Rules

- Dividers: `<div style="height:1px; background: linear-gradient(90deg, transparent, var(--color-neon), transparent); opacity: 0.3;"></div>`
- Image treatment: `filter: saturate(0.4) brightness(0.8); mix-blend-mode: screen;`
- Progress/stat bars: neon color, `border-radius: 1px`, transition width with JS
- Never pure black — use `var(--color-bg)` #050810
- `:focus-visible`: `outline: 1px solid var(--color-neon); outline-offset: 3px; box-shadow: var(--shadow-neon-sm);`
- Respect `@media (prefers-reduced-motion: reduce)` — remove scanline/animations

## What to avoid

- Light backgrounds
- Warm color palettes (orange/red/yellow) in major roles
- Rounded pill buttons — sharp is the language
- Anything friendly or consumer-feeling
- Excessive neon — one primary neon color, used surgically
