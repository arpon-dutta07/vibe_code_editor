# Design Style: GlassDark

You are building a premium dark glassmorphism UI — frosted glass panels floating over deep gradient backgrounds. Think macOS Sonoma, iOS Lock Screen, or high-end SaaS dark dashboards.

## Design Token System

```css
:root {
  /* Background */
  --bg-base:      #08091a;
  --bg-gradient:  linear-gradient(135deg, #080914 0%, #0d1545 50%, #160a2e 100%);

  /* Glass surfaces */
  --glass-fill:   rgba(255,255,255,0.05);
  --glass-fill-2: rgba(255,255,255,0.09);
  --glass-border: rgba(255,255,255,0.10);
  --glass-border-2: rgba(255,255,255,0.20);
  --glass-blur:   18px;

  /* Colors */
  --color-text:    #f0f2ff;
  --color-text-2:  #b0b8d8;
  --color-text-3:  #7880b0;
  --color-accent:  #6366f1;
  --color-accent-2:#a78bfa;
  --color-glow:    rgba(99,102,241,0.4);

  /* Spacing — 8px scale */
  --space-1: 4px;  --space-2: 8px;   --space-3: 12px;
  --space-4: 16px; --space-6: 24px;  --space-8: 32px;
  --space-10: 40px; --space-12: 48px; --space-16: 64px;
  --space-20: 80px; --space-24: 96px;

  /* Radius */
  --radius-sm: 8px; --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 28px;

  /* Multi-layer glow shadows */
  --shadow-glass: 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
  --shadow-glow:  0 0 30px var(--color-glow), 0 4px 16px rgba(0,0,0,0.4);
  --shadow-card:  0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06);

  /* Transitions */
  --t-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --t-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);

  /* Fonts */
  --font-sans: 'Sora', 'Plus Jakarta Sans', system-ui, sans-serif;
}
```

## Typography

- Font: `'Sora'` — `https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap`
- Display: `font-size: clamp(2.8rem, 6vw, 5.5rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.06;`
- Gradient headline: `background: linear-gradient(135deg, #f0f2ff 30%, var(--color-accent-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;`
- H2: `font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: -0.02em;`
- Body: `font-size: 1rem; line-height: 1.75; color: var(--color-text-2);`

## Background & Ambient Light

```css
body {
  background: var(--bg-gradient);
  min-height: 100vh;
  position: relative;
}

/* Ambient orbs — create depth */
.orb-1, .orb-2, .orb-3 {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}
.orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, #6366f1, transparent); top: -200px; right: -100px; }
.orb-2 { width: 500px; height: 500px; background: radial-gradient(circle, #7c3aed, transparent); bottom: -150px; left: -100px; }
.orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, #4f46e5, transparent); top: 40%; left: 50%; }
```

## Glass Panel Pattern

```css
.glass {
  background: var(--glass-fill);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition: background var(--t-base), border-color var(--t-base), box-shadow var(--t-base);
}
.glass:hover {
  background: var(--glass-fill-2);
  border-color: var(--glass-border-2);
}
/* Top highlight on glass panels */
.glass::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}
```

## Component Patterns

```css
/* Primary button */
.btn-primary {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-2));
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 12px 28px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: box-shadow var(--t-base), transform var(--t-fast);
}
.btn-primary:hover { box-shadow: var(--shadow-glow); transform: translateY(-2px); }

/* Ghost button */
.btn-ghost {
  background: var(--glass-fill);
  color: var(--color-accent-2);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 11px 28px;
  font-weight: 500;
  backdrop-filter: blur(var(--glass-blur));
  transition: background var(--t-base), border-color var(--t-base);
}
.btn-ghost:hover { background: var(--glass-fill-2); border-color: var(--glass-border-2); }
```

## Visual Rules

- Every section has `position: relative; z-index: 1` to float above orbs
- Dividers: `linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)` — 1px height div
- Stat numbers: `font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 800; color: var(--color-accent-2);`
- No pure black backgrounds — use gradient or `--bg-base`
- No hard box-shadows — only blur+glow system
- Images: `mix-blend-mode: luminosity; filter: saturate(0.6) brightness(0.9);` for moody treatment
- Scrollbar: `scrollbar-width: thin; scrollbar-color: var(--color-accent) var(--bg-base);`
- `:focus-visible`: `outline: 2px solid var(--color-accent); outline-offset: 3px;`

## Content All sections need z-index: 1 above the orbs.

## What to avoid

- Light backgrounds in any section
- Flat solid-color cards (always glass)
- Warm colors (orange/red/yellow) unless rare accent
- Hard shadows without blur
- Opaque backgrounds that kill the glass effect
