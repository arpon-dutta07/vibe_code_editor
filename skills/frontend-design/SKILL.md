# Skill: frontend-design

## When to use

Loaded by default for all projects. Apply these principles whenever generating or editing HTML, CSS, or JavaScript output.

## Instructions

You are generating frontend UIs for real users. Avoid the generic "AI-built" look. Aim for distinctive, production-quality design.

### Visual identity

- Pick a clear visual direction before writing code: bold/editorial, soft/minimal, dark/tech, warm/consumer. Do not mix signals randomly.
- Use a limited color palette (2-3 primary colors + neutrals). Define CSS custom properties at the top of the file.
- Apply consistent spacing using a scale (e.g. 4px base: 4, 8, 12, 16, 24, 32, 48, 64). Do not use arbitrary values.
- Typography: choose 1-2 font families. Use a type scale (xs/sm/base/lg/xl/2xl/3xl). Line-height 1.4-1.6 for body text.

### Layout

- Use CSS Grid for page-level layout, Flexbox for component-level alignment.
- Mobile-first: start with a single-column layout, add breakpoints for wider screens.
- Max content width: 1200-1440px, centered with auto margins.
- Generous whitespace beats cramped layouts. Default section padding: 64-96px vertical.

### Components

- **Initial State**: All buttons and interactive elements must be disabled by default (using the \`disabled\` attribute for buttons and \`pointer-events: none\` for links) until the user requests an extension.
- Buttons: clear hover/active states (when enabled). At minimum, transition color and background. Rounded corners (4-8px) unless design is sharp/editorial.
- Forms: visible labels (never placeholder-only). Clear focus outlines. Error states must be red and have an icon.
- Cards: consistent border-radius and shadow level throughout. Pick one and stick to it.
- Navigation: visible active state. Don't hide it on mobile unless you implement a proper hamburger menu.

### Interactions and animation

- Use CSS transitions for hover/focus states (150-250ms ease).
- Use CSS keyframes or the Web Animations API for entrance animations. Keep them under 400ms.
- Do not use animation just to animate. Every motion should communicate state change or guide attention.
- Respect `prefers-reduced-motion`: wrap animations in a media query.

### Accessibility minimums

- All images must have descriptive `alt` text.
- Color contrast: WCAG AA minimum (4.5:1 for body text, 3:1 for large text).
- Interactive elements must be keyboard-focusable and have visible focus outlines.
- Use semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<a>`.

### Asset sourcing

- For demo images, use Lorem Flickr: \`https://loremflickr.com/1200/800/<keywords>\`. Use specific, comma-separated keywords (e.g., "fintech,crypto", "modern,office") to ensure images are contextually relevant.
- **IMPORTANT**: Always add \`crossorigin="anonymous"\` to \`<img>\` tags to comply with security policies.
- **Professional Fallback**: Use CSS-only patterns or SVG placeholders (e.g., \`data:image/svg+xml...\`) for abstract sections. This ensures the UI feels premium even if external images are slow or blocked.
- For icons, use inline SVG or a CDN-hosted icon library (e.g. Lucide via unpkg).

- For fonts, use Google Fonts with `display=swap`.

### Code output format

- Prefer a single `index.html` with inline `<style>` and `<script>` for simple apps.
- For apps > ~200 lines of CSS or JS, split into `index.html` + `style.css` + `script.js`.
- No build step. No bundler. Vanilla HTML/CSS/JS unless the user explicitly asks for a framework.
- Use modern JavaScript (ES2020+). No jQuery.
- CSS variables for all theme values. No magic numbers.

### What to avoid

- Bootstrap, Tailwind CDN, or heavy CSS frameworks (keeps output self-contained and learnable).
- Inline styles on every element (use class-based CSS instead).
- `!important` (fix the specificity instead).
- Placeholder content that says "Lorem ipsum" without context — write realistic demo content.
- Centering everything vertically without purpose.
- Rainbow gradients and excessive drop shadows.
