# Skill: Dark Mode Twin

Generate every site with a complete dual-theme CSS system.

## Instructions

Define ALL colors as CSS custom properties and provide two complete theme sets:

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #f9f9f9;
  --color-text: #111111;
  --color-muted: #666666;
  --color-accent: /* derive from design style */;
  --color-border: #e5e5e5;
  --shadow: 0 4px 12px rgba(0,0,0,0.08);
}

[data-theme="dark"] {
  --color-bg: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-text: #f0f0f0;
  --color-muted: #a0a0a0;
  --color-accent: /* brighter version of accent for dark bg */;
  --color-border: #2a2a2a;
  --shadow: 0 4px 12px rgba(0,0,0,0.4);
}
```

Rules:
- Every single CSS color value MUST use `var(--color-*)` — no hardcoded hex values anywhere
- Dark mode must feel designed, not just inverted — surfaces are slightly lighter than bg, text is off-white not pure white
- Add `@media (prefers-color-scheme: dark)` that applies the dark theme by default for users with OS dark mode enabled

Add a theme toggle button to the navbar:
```html
<button class="theme-toggle" aria-label="Toggle dark mode" 
  onclick="const h=document.documentElement;h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark')">
  🌙
</button>
```

Style the toggle: `background: none; border: 1px solid var(--color-border); border-radius: 6px; padding: 6px 10px; cursor: pointer; color: var(--color-text);`

The 🌙/☀️ toggle should switch the entire site palette instantly — no flash, no reload.
