# Design Style: WarmEarth

You are building a page that feels human, grounded, and approachable — like a wellness brand, artisan shop, or mindful SaaS. Think Notion, Calm, Curology, or a well-designed Substack publication.

## Color System

```css
:root {
  --color-bg:        #fdf8f3;   /* warm cream */
  --color-surface:   #ffffff;
  --color-surface2:  #f2ebe2;   /* linen */
  --color-border:    #e8ddd0;
  --color-text:      #2c2420;   /* warm near-black */
  --color-text-sub:  #7c6a5e;
  --color-accent:    #c47c4a;   /* terracotta */
  --color-accent2:   #6b8f71;   /* sage green */
  --color-accent3:   #9b7bb8;   /* lavender */
  --radius-card:     16px;
  --radius-btn:      9999px;    /* pill buttons feel approachable */
  --shadow-soft:     0 2px 20px rgba(100, 60, 30, 0.08);
}
```

## Typography

- Headings: `'Lora'` or `'Crimson Pro'` — warm serifs feel personal.
- Body: `'Nunito'` or `'DM Sans'` — friendly, round, easy to read.
- Import: `https://fonts.googleapis.com/css2?family=Lora:wght@400;600;700&family=Nunito:wght@400;500;600&display=swap`
- Hero headline: `font-size: clamp(2.2rem, 5vw, 3.8rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; color: var(--color-text);`
- Subtext: light weight, warm subdued color.
- Accent words in headings: `color: var(--color-accent); font-style: italic;`

## Layout Patterns

- Hero: centered content, warm illustration or photography, rounded container.
- Sections alternate background between `--color-bg` and `--color-surface2` for gentle rhythm.
- Cards: generous padding (28–32px), soft shadow, rounded corners. No harsh borders.
- Feature sections: staggered image-text alternating layout (img-left text-right, then flip).
- Testimonials: large quote mark (`"`) in accent color, soft card background.

## Component Rules

- Primary button: filled terracotta. Pill shape. Hover: darken + slight scale-up.
  ```css
  .btn { background: var(--color-accent); color: white; border-radius: var(--radius-btn); padding: 13px 30px; font-weight: 600; font-size: 0.95rem; transition: all 0.2s; }
  .btn:hover { background: #a86640; transform: scale(1.02); box-shadow: var(--shadow-soft); }
  ```
- Secondary button: transparent, terracotta border + text. Same pill shape.
- Cards: `background: white; border-radius: var(--radius-card); box-shadow: var(--shadow-soft); padding: 28px;`
- Tags: rounded-full, sage green tint. Lowercase.
- Avatars: circular, warm border (`3px solid var(--color-surface2)`).

## Visual Rules

- Images: warm-toned, preferably lifestyle photography. Subtle vignette.
- Illustrations: flat, warm palette. Use SVG inline where possible.
- Icons: rounded stroke (Lucide works well), 20px, terracotta or sage.
- Background textures: very subtle linen/paper noise via CSS `filter`.
- Decorative blobs: CSS `border-radius: 70% 30% 60% 40% / 50% 60% 40% 50%` shapes in accent color at 10% opacity.
- Section spacing: 80px vertical, 48px on mobile.

## What to avoid

- Cold blues, hard blacks, or techy greys.
- Sharp corners on cards or buttons.
- Drop shadows that feel heavy (box-shadow blur > 40px starts feeling gross).
- Dense text blocks without breathing room.
- Neon or overly saturated colors.
- Anything that feels corporate or cold.
