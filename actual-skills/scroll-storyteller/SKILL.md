# Skill: Scroll Storyteller

Restructure the site as a scroll-snap narrative experience.

## Instructions

Restructure the generated site as a scroll-driven narrative:

```css
html, body {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}
```

Every top-level `<section>` and `<header>`:
```css
scroll-snap-align: start;
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
```

Entrance animations for each section (staggered by child index):
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

section:nth-child(1) > * { animation: fadeSlideUp 0.6s 0.1s ease both; }
section:nth-child(2) > * { animation: fadeSlideUp 0.6s 0.1s ease both; }
/* repeat for each section */
```

Add a scroll progress indicator — fixed right side:
```html
<nav class="scroll-dots" aria-label="Page sections">
  <!-- one <a> dot per section, e.g. <a href="#hero"></a> <a href="#features"></a> -->
</nav>
```

```css
.scroll-dots {
  position: fixed; right: 24px; top: 50%; transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 12px; z-index: 100;
}
.scroll-dots a {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(128,128,128,0.3); transition: background 0.3s ease;
  display: block;
}
.scroll-dots a:hover { background: var(--color-accent, #333); }
```

Use JavaScript to update the active dot on scroll:
```js
const sections = document.querySelectorAll('section[id], header[id]')
const dots = document.querySelectorAll('.scroll-dots a')
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      dots.forEach(d => d.style.background = '')
      const dot = document.querySelector(`.scroll-dots a[href="#${e.target.id}"]`)
      if (dot) dot.style.background = 'var(--color-accent, #333)'
    }
  })
}, { threshold: 0.5 })
sections.forEach(s => observer.observe(s))
```

Every `<section>` must have a unique `id` attribute for the dot links to work.
