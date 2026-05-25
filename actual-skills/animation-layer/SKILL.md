# Skill: Animation Layer

Add CSS micro-interactions and entrance animations throughout the page.

## Instructions

Add the following animations and micro-interactions:

**Universal keyframes (always include):**
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0.2); }
  50%       { box-shadow: 0 0 0 10px rgba(0,0,0,0); }
}
```

**All buttons:**
```css
transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
cursor: pointer;
/* :hover */ transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15);
/* :active */ transform: translateY(0);
```

**All cards:**
```css
transition: transform 0.3s ease, box-shadow 0.3s ease;
/* :hover */ transform: translateY(-4px);
```

**Hero section:** `animation: fadeSlideUp 0.8s ease both;`

**Feature cards — staggered:**
```css
animation: fadeSlideUp 0.6s ease both;
/* nth-child delays */
:nth-child(1) { animation-delay: 0.1s; }
:nth-child(2) { animation-delay: 0.2s; }
:nth-child(3) { animation-delay: 0.3s; }
:nth-child(4) { animation-delay: 0.4s; }
```

**Decorative/hero illustration elements:** `animation: float 4s ease-in-out infinite;`

**Primary CTA button:** add `animation: pulse 2s ease-in-out infinite;`

**Navigation links:** underline slide-in on hover using `::after` pseudo-element:
```css
nav a::after {
  content: ''; display: block; height: 2px;
  background: var(--color-accent); transform: scaleX(0);
  transition: transform 0.2s ease; transform-origin: left;
}
nav a:hover::after { transform: scaleX(1); }
```

**Animation toggle button** — fixed bottom-right:
```html
<button onclick="document.body.classList.toggle('no-animations')" 
        class="anim-toggle"
        style="position:fixed;bottom:20px;right:20px;z-index:9999;background:#111;color:#fff;border:none;border-radius:20px;padding:8px 14px;cursor:pointer;font-size:12px;">
  ⚡ Animations
</button>
```
```css
.no-animations * { animation: none !important; transition: none !important; }
```
