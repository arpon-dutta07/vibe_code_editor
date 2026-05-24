# Design Style: Brutalist Bold

Raw, intentional, anti-design. Giant type, hard borders, jarring contrast.

## Color System

```css
:root {
  --color-bg:      #FFFFFF;
  --color-text:    #000000;
  --color-accent:  #FF4136;
  --color-yellow:  #FFD700;
  --color-border:  #000000;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&display=swap`
- Font: `'Space Grotesk', system-ui, sans-serif` — 700/900 weights for everything
- Headings: `font-size: clamp(3rem, 8vw, 8rem); font-weight: 900; line-height: 0.9; text-transform: uppercase; color: #000;`
- Body: `font-size: 1.1rem; font-weight: 700; line-height: 1.5;`

## Layout

- Deliberately asymmetric — break the grid intentionally
- Overlapping elements via `position: absolute` where impactful
- Sections: some `background: #FFD700`, some `background: #FF4136`, some `#FFFFFF` — jarring contrast is intentional
- Section borders: `border-top: 4px solid #000; border-bottom: 4px solid #000;`

## Component Rules

- Borders: `3px–5px solid #000000` on all cards, sections, and buttons
- Hard offset shadow: `box-shadow: 5px 5px 0 #000; border-radius: 0;`
- Buttons: `background: #FF4136; color: #FFF; border: 3px solid #000; border-radius: 0; box-shadow: 5px 5px 0 #000; font-weight: 900; text-transform: uppercase; padding: 14px 32px;`
  Hover: `transform: translate(3px, 3px); box-shadow: 2px 2px 0 #000;`
- Cards: `border: 4px solid #000; border-radius: 0; padding: 24px;`
- Images/placeholders: `border: 3px solid #000; border-radius: 0;`

## Decorative Rules

- Use CSS pseudo-elements for geometric accent blocks
- Diagonal slashes, exposed grid lines, and stacked oversized numbers as decoration
- Negative space is intentional — don't fill it

## What to Avoid

- Rounded corners (strictly 0 border-radius)
- Gradients or glassmorphism
- Anything that looks "designed" or polished in the conventional sense
- Subtle shadows — go hard or go none
