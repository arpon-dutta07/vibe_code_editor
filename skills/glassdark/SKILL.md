# Design Style: GlassDark

You are building a page that uses dark glassmorphism — frosted glass panels floating over rich dark gradients. Think macOS Sonoma, iOS Lock Screen, premium crypto dashboards, or high-end SaaS dark mode.

## Color System

```css
:root {
  --color-bg:        #08091a;
  --color-bg2:       #0e1030;
  --grad-bg:         linear-gradient(135deg, #0a0a1a 0%, #0d1545 50%, #1a0a2e 100%);
  --color-glass:     rgba(255, 255, 255, 0.05);
  --color-glass-border: rgba(255, 255, 255, 0.12);
  --color-glass-hover:  rgba(255, 255, 255, 0.09);
  --color-text:      #f0f2ff;
  --color-text-sub:  #8b90cc;
  --color-accent:    #6366f1;   /* indigo */
  --color-accent2:   #a78bfa;   /* soft violet */
  --color-glow:      rgba(99, 102, 241, 0.35);
  --radius-glass:    20px;
  --blur:            16px;
}
```

## Typography

- Headings: `'Sora'` or `'Plus Jakarta Sans'` — modern, geometric.
- Body: `'Inter'`.
- Import: `https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500&display=swap`
- Display: `font-size: clamp(2.8rem, 7vw, 5rem); font-weight: 800; letter-spacing: -0.03em; line-height: 1.08;`
- Gradient text for hero headline: `background: linear-gradient(90deg, #f0f2ff, var(--color-accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`

## Glass Panel Pattern

```css
.glass {
  background: var(--color-glass);
  backdrop-filter: blur(var(--blur));
  -webkit-backdrop-filter: blur(var(--blur));
  border: 1px solid var(--color-glass-border);
  border-radius: var(--radius-glass);
}
.glass:hover {
  background: var(--color-glass-hover);
  border-color: rgba(255,255,255,0.2);
}
```

## Layout Patterns

- Background: `background: var(--grad-bg)` on `body`. Add 2-3 large blurred orbs as decorative elements:
  ```css
  .orb { position: fixed; border-radius: 50%; filter: blur(80px); opacity: 0.35; pointer-events: none; }
  .orb-1 { width: 500px; height: 500px; background: #6366f1; top: -200px; right: -100px; }
  .orb-2 { width: 400px; height: 400px; background: #7c3aed; bottom: -100px; left: -100px; }
  ```
- Hero: centered, large gradient headline, glass CTA card or button group below.
- Feature cards: glass panels in a 3-col grid. Each floats with subtle top-border highlight.
- Stats row: glass strip, numbers large in `--color-accent2`, labels below in `--color-text-sub`.

## Component Rules

- Primary button: gradient fill `linear-gradient(135deg, var(--color-accent), var(--color-accent2))`. Border-radius 12px. Hover: glow.
  ```css
  .btn { background: linear-gradient(135deg, #6366f1, #a78bfa); color: white; border: none; border-radius: 12px; padding: 13px 28px; font-weight: 600; transition: all 0.25s; }
  .btn:hover { box-shadow: 0 0 30px var(--color-glow); transform: translateY(-1px); }
  ```
- Ghost button: glass style — transparent, glass border, text in `--color-accent2`.
- Cards: glass panel. Top edge: `border-top: 1px solid rgba(255,255,255,0.2)`.
- Input fields: glass background, light border, `--color-text` value, `--color-text-sub` placeholder.

## Visual Rules

- Background orbs create ambient light — position them deliberately (hero top-right, footer bottom-left).
- Dividers: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`.
- Subtle star-field: `background-image: radial-gradient(1px 1px at Xpx Ypx, rgba(255,255,255,0.4), transparent)` — repeat via JS or CSS pattern.
- Images: apply `mix-blend-mode: luminosity` on dark overlays.
- Scrollbar: slim, dark, `--color-accent` thumb.
- No hard box shadows. Everything uses `backdrop-filter` blur or glow.

## What to avoid

- Light backgrounds in any major section.
- Solid flat-colored cards (always use glass effect).
- Warm colors (orange, red, yellow) unless used as rare accents.
- Generic gradient buttons (the glass + glow system is the differentiator here).
- Opaque overlays that kill the glass effect.
