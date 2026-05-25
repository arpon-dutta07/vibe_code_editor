# Skill: Component Library Drop

In addition to the main site, generate a complete component library page as a second file.

## Instructions

After generating `index.html`, also call `write_file` to create a second file: `components.html`.

This file is a standalone Component Library page — same design style as the main site, documenting every UI component. It must be openable directly in a browser.

The Component Library page must include these sections:

**1. Color Palette** — Display every CSS custom property color as a swatch card: colored square (60x60px) + variable name + hex value.

**2. Typography Scale** — Show every font size: Display / H1 / H2 / H3 / H4 / Body / Small / Caption. Each rendered at correct size/weight with CSS values shown below in a mono font.

**3. Buttons**
- Primary (default + hover via CSS)
- Secondary / outline
- Ghost
- Disabled (`opacity: 0.5; cursor: not-allowed`)
- Small / Medium / Large sizes
- Button with leading icon (use → ← ✓ as Unicode icons)

**4. Form Elements**
- Text input (default, :focus, error states)
- Textarea
- Select dropdown
- Checkbox (checked + unchecked)
- Radio buttons (2 options)
- Label styles

**5. Cards**
- Basic card (shadow, border-radius, padding)
- Card with image placeholder (image top, content below)
- Horizontal card (image left, text right)
- Stat card (large number, label, trend indicator)

**6. Badges & Tags** — 4 badge variants: primary, success, warning, error. Pill-shaped tags.

**7. Alerts / Callouts**
- Info (blue left-border + ℹ)
- Success (green left-border + ✓)
- Warning (yellow left-border + ⚠)
- Error (red left-border + ✗)

Each section separated by `<hr>` and labeled with `<h2>`. Page header: `[Design Style] Component Library`.

Do NOT use any external dependencies — pure HTML/CSS, same inline styles as the main site.
