# Design Style: BoldCraft

You are building a page with strong editorial presence — massive typography, unapologetic contrast, and confident white space. Think NYT Magazine, Bloomberg Businessweek covers, award-winning agency sites, or Pentagram work.

## Color System

```css
:root {
  --color-bg:        #f5f2ed;   /* warm off-white */
  --color-ink:       #0d0d0d;   /* near-black */
  --color-accent:    #d62828;   /* editorial red */
  --color-accent2:   #f4c430;   /* saffron yellow */
  --color-surface:   #ffffff;
  --color-border:    #0d0d0d;   /* borders are black in editorial */
  --color-text-sub:  #555555;
  --radius-card:     0px;       /* editorial is square */
  --radius-btn:      0px;
}
```

## Typography

- Display: `'Playfair Display'` or `'DM Serif Display'` for serif drama. OR `'Barlow Condensed'` for a bold condensed sans.
- Body: `'IBM Plex Sans'` or `'Source Serif Pro'`.
- Import: `https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=IBM+Plex+Sans:wght@400;500&display=swap`
- Hero headline: `font-size: clamp(4rem, 12vw, 10rem); font-weight: 900; line-height: 0.92; letter-spacing: -0.03em;`
- Subheading: `font-size: 1.1rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.15em;` — acts as a label.
- Big numbers / stats: full viewport-width possible. Treat them as graphical elements.

## Layout Patterns

- Hero: oversized text as the primary visual. Headline breaks to 1-3 words per line.
- Use `CSS Grid` with named areas. Don't be afraid of asymmetry.
- Section dividers: thick black horizontal rule `border-top: 3px solid var(--color-ink)` + generous padding.
- Pull quotes: large, indented left with a colored left border `4px solid var(--color-accent)`.
- Sidebar layouts for long-form content.
- Column grid: strict 12-column for desktop, 6 for tablet. Spans vary intentionally.

## Component Rules

- Buttons: rectangular, black background, white text, 0 border-radius. Hover: invert colors.
  ```css
  .btn { background: var(--color-ink); color: white; padding: 14px 32px; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.8rem; font-weight: 600; border: 2px solid var(--color-ink); }
  .btn:hover { background: white; color: var(--color-ink); }
  ```
- Cards: no shadow. Distinguished by border `1px solid var(--color-ink)` and background swap.
- Links: underline by default. Hover: background highlight (accent color at 20% opacity).
- Accent splashes: use `--color-accent` and `--color-accent2` only for 1-2 elements. Never fill sections.

## Visual Rules

- Images: black-and-white or high-contrast treatment preferred. Duotone with ink + accent.
- Negative space is a design element. Don't fill it.
- Text overlapping images is encouraged when contrast is maintained.
- Horizontal rules, footnote numbers, and editorial annotations add richness.
- Number the sections with large ordinals (`01`, `02`) in muted grey.

## What to avoid

- Soft pastel palettes.
- Rounded corners on anything structural.
- Drop shadows.
- Small, timid text.
- Centered everything (editorial respects the left edge).
- Busy backgrounds.
