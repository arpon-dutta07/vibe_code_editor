# Skill: Wireframe to Website

Convert plain-English layout descriptions into precise HTML structure.

## Instructions

Look for a layout description in the user's message. Parse it carefully:

Layout translation rules:
- "3 columns" → CSS Grid, `grid-template-columns: repeat(3, 1fr)`
- "sidebar" → `<aside>` with fixed width (280px), main content fills remainder
- "hero" → full-width `<section>` with `min-height: 80vh`
- "split" → two equal flex children, `flex: 1` each
- "strip" → full-width narrow band, `padding: 24px 0`
- "grid of N" → CSS Grid with N columns on desktop, fewer on mobile
- "full width" → `width: 100%`, no max-width constraint

Build the structure first, then apply design style visuals on top. Every major layout section gets a descriptive class name matching the description (e.g. `class="three-col-features"`, `class="right-sidebar"`).

Add a Wireframe Toggle button fixed to the bottom-right corner of the generated page:

```html
<button onclick="document.body.classList.toggle('wireframe-mode')" 
        style="position:fixed;bottom:20px;right:20px;z-index:9999;padding:8px 14px;background:#333;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:12px;">
  Toggle Wireframe
</button>
```

In wireframe mode CSS:
```css
.wireframe-mode * {
  background: #F5F5F5 !important;
  color: #999 !important;
  border: 2px dashed #CCCCCC !important;
  box-shadow: none !important;
  image-rendering: pixelated;
}
.wireframe-mode img { filter: grayscale(1) opacity(0.3) !important; }
```

If no layout description is provided, generate based on the user's content prompt and add the wireframe toggle anyway.
