# Design Style: Futuristic

You are building a page that feels like it belongs to a sci-fi universe or a cutting-edge tech startup in 2040. Think Cyberpunk, SpaceX, neon-drenched dark UIs, holographic panels.

## Color System

```css
:root {
  --color-bg:        #050810;
  --color-surface:   #0c1120;
  --color-surface2:  #111827;
  --color-border:    rgba(0, 255, 200, 0.15);
  --color-text:      #e8f4ff;
  --color-text-sub:  #7090b0;
  --color-neon:      #00ffc8;   /* primary neon */
  --color-neon2:     #7c3aed;   /* deep violet */
  --color-neon3:     #f0abfc;   /* soft magenta */
  --color-glow:      rgba(0, 255, 200, 0.25);
  --radius-card:     4px;
  --radius-btn:      2px;
}
```

## Typography

- Headings: `'Orbitron'` or `'Space Grotesk'` (Google Fonts). Uppercase for large display. Letter-spacing 0.04–0.12em.
- Body: `'Share Tech Mono'` or `'JetBrains Mono'` for techy feel. For readability-first: `'Inter'`.
- Glow text: `text-shadow: 0 0 20px var(--color-neon), 0 0 60px rgba(0,255,200,0.3)`.
- Import: `https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap`

## Layout Patterns

- Hero: full-viewport, dark bg, large headline center-or-left, animated particle or grid overlay (CSS only: subtle dot-grid background-image).
- Grid overlay: `background-image: linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px); background-size: 40px 40px;`
- Sections separated by neon `border-top: 1px solid var(--color-border)`.
- Cards: dark surface with neon border on hover. Sharp corners.

## Component Rules

- Buttons: dark fill + neon border. Hover: neon background, dark text, outer glow. 
  ```css
  .btn { background: transparent; border: 1px solid var(--color-neon); color: var(--color-neon); letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.75rem; padding: 12px 28px; transition: all 0.2s; }
  .btn:hover { background: var(--color-neon); color: #000; box-shadow: 0 0 24px var(--color-glow); }
  ```
- Cards: `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-card)`. Neon top-border accent (3px) on hover.
- Tags/badges: monospace, uppercase, `0.6rem`, neon color, border.
- Progress bars / stat counters: animate on scroll using Intersection Observer.

## Animation Rules

- Scanline shimmer on hero: `@keyframes scanline { 0% { transform: translateY(-100%) } 100% { transform: translateY(100vh) } }` — single thin line, very subtle.
- Entrance: `opacity 0 → 1` + `translateY(20px → 0)` over 0.4s ease-out. Stagger children by 80ms.
- Cursor glow: optional custom cursor with neon drop-shadow on `:root`.
- Respect `prefers-reduced-motion`.

## Visual Rules

- Background: near-black, never pure black. Subtle noise or grid texture.
- Images: high-contrast, desaturate slightly, add neon color overlay (`mix-blend-mode: screen`).
- Dividers: neon gradient lines `linear-gradient(90deg, transparent, var(--color-neon), transparent)`.
- Stats/numbers: large, monospace, neon color, with a label below in subdued text.
- No rounded corners except for avatar circles.

## What to avoid

- Light backgrounds.
- Warm color palettes (oranges, pinks unless stylized sci-fi).
- Generic stock photography without treatment.
- Bootstrap-style rounded buttons.
- Anything that looks "friendly" or "consumer" — this is cold, precise, powerful.
