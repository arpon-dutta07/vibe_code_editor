# Skill: Multilingual Layout Switcher

Generate the site with full bidirectional (BiDi) layout support — LTR and RTL.

## Instructions

HTML setup: `<html lang="en" dir="ltr">`

Write all layout using CSS logical properties:
- Instead of `margin-left` → use `margin-inline-start`
- Instead of `padding-right` → use `padding-inline-end`
- Instead of `border-left` → use `border-inline-start`
- Instead of `left: 0` → use `inset-inline-start: 0`
- Instead of `text-align: left` → use `text-align: start`

For properties without logical equivalents, add RTL overrides:
```css
[dir="rtl"] .navbar { flex-direction: row-reverse; }
[dir="rtl"] .hero-content { text-align: right; }
[dir="rtl"] .feature-card { text-align: right; }
[dir="rtl"] .icon-before { margin-left: 0; margin-right: 8px; }
[dir="rtl"] .sidebar { order: 1; }
```

Typography in RTL mode — add Noto Sans Arabic as fallback:
```css
[dir="rtl"] body {
  font-family: 'Noto Sans Arabic', var(--font-main), sans-serif;
}
```

Add to Google Fonts import: `&family=Noto+Sans+Arabic:wght@400;600;700`

Add direction toggle button to the navbar:
```html
<button 
  onclick="const h=document.documentElement;h.dir=h.dir==='rtl'?'ltr':'rtl';"
  class="dir-toggle"
  aria-label="Toggle text direction"
  style="background:none;border:1px solid var(--color-border,#ddd);border-radius:6px;padding:6px 10px;cursor:pointer;">
  🌐 RTL/LTR
</button>
```

Test these reversal cases are correct:
- Navbar links order reverses
- Hero text aligns to the correct side
- Card icon + text arrangement mirrors
- Flex rows reverse direction naturally
- Decorative left-border elements switch to right-border
