# Skill: Responsive Wizard

Generate fully responsive layouts with explicit breakpoints and device previews.

## Instructions

Generate a fully responsive layout with explicit CSS media queries. Use mobile-first approach:

**Base styles (mobile, ~375px):**
- Single column layout for all grid sections
- Full-width: nav, hero, cards, images
- Font sizes: base 16px, `h1: clamp(2rem, 8vw, 3rem)`, `h2: clamp(1.5rem, 5vw, 2rem)`
- CSS-only hamburger nav: use checkbox hack for mobile menu toggle
- Section padding: `48px 20px`
- Hide decorative side elements

**Tablet `@media (min-width: 768px)`:**
- 2-column grid for feature/card sections
- Show sidebar if present (65%/35% split)
- Section padding: `64px 32px`
- Show full horizontal nav, hide checkbox menu
- Font sizes increase ~15%

**Desktop `@media (min-width: 1280px)`:**
- Full layout: 3+ column grids
- Section padding: `80px 0`, inner container `max-width: 1140px; margin: 0 auto`
- All decorative elements visible
- Font sizes at maximum clamp values

**Device Preview Section** — add at the BOTTOM of the generated HTML:

Three CSS-drawn device frames side by side showing how the layout looks at each breakpoint. Use `border-radius`, `box-shadow`, and `overflow: hidden` to draw phone/tablet/laptop outlines. Scale each frame down using `transform: scale()`. Label each with its breakpoint width. Wrap in a `<section class="device-preview-strip">` with a light grey background.

Comment all media queries clearly: `/* === Tablet 768px === */` and `/* === Desktop 1280px === */`
