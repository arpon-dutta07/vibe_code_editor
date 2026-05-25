# Skill: Accessibility Auditor

Generate HTML with full WCAG 2.1 AA accessibility compliance.

## Instructions

Every page must include these accessibility features:

**Structure & Semantics:**
- First element in `<body>`: `<a href="#main-content" class="skip-link">Skip to main content</a>`
  CSS: `position:absolute; left:-9999px;` on `:focus`: `left:0; top:0; z-index:9999; background:var(--color-accent);color:white;padding:8px 16px;`
- ARIA landmarks: `role="banner"` (header), `role="navigation"` (nav), `role="main"` (main), `role="contentinfo"` (footer)
- All `<nav>` elements: `<nav aria-label="Primary navigation">`
- Icon-only buttons and links: add `aria-label` with descriptive text

**Images & Media:**
- Every `<img>` must have a descriptive `alt` attribute (not empty, not "image of")
- Purely decorative elements: `aria-hidden="true"`

**Forms & Interactivity:**
- Every `<input>` must have an associated `<label>` with matching `for`/`id` attributes
- Buttons must have descriptive text (not "Click here" or just an icon)
- All interactive elements reachable via Tab key

**Color & Contrast:**
- Text on backgrounds: ≥ 4.5:1 contrast ratio for normal text, 3:1 for large text (18px+ or 14px bold+)
- Never convey info by color alone — always pair with text or icon
- All `:focus` states: visible `3px solid` outline in accent color — NEVER `outline: none`

**At the bottom of `<body>`**, add a collapsible Accessibility Report Panel:

```html
<details style="margin:40px;border:1px solid #d1fae5;border-radius:8px;background:#f0fdf4;padding:16px;">
  <summary style="font-weight:600;cursor:pointer;color:#065f46;">♿ Accessibility Report</summary>
  <ul style="margin-top:12px;list-style:none;padding:0;display:flex;flex-direction:column;gap:6px;">
    <li>✅ Skip-to-content link</li>
    <li>✅ ARIA landmark roles</li>
    <li>✅ All images have alt text</li>
    <li>✅ Form inputs have labels</li>
    <li>✅ Visible focus styles (no outline:none)</li>
    <li>✅ Color contrast ≥ 4.5:1</li>
    <li>✅ Keyboard navigable</li>
    <li>✅ Semantic HTML5 structure</li>
  </ul>
</details>
```
