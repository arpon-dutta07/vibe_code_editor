# Design Style: Luxury Gold

Black canvas, gold accents, italic serifs. Jewelry, fashion, premium services.

## Color System

```css
:root {
  --color-bg:         #0F0F0F;
  --color-surface:    #1C1C1C;
  --color-gold:       #D4AF37;
  --color-gold-light: #F2D06B;
  --color-text:       #F5F0E8;
  --color-muted:      #9E9076;
  --color-border:     rgba(212,175,55,0.2);
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:wght@300;400;600&display=swap`
- Headings: `'Playfair Display', Georgia, serif` — italic, gold, refined
- Body: `'Cormorant Garamond', Georgia, serif`
- Heading style: `font-style: italic; color: var(--color-gold); letter-spacing: 0.05em; font-weight: 700;`
- Body: `font-size: 1.05rem; line-height: 1.8; color: var(--color-text); font-weight: 300;`

## Layout

- Body bg: `#0F0F0F` — pure near-black
- Section padding: `100px 0` — very generous
- Containers: `max-width: 1000px` — narrower for luxury feel

## Component Rules

- Dividers: `border-top: 1px solid rgba(212,175,55,0.3)`
- Gold accent line before section titles:
  ```css
  .section-title::before {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: #D4AF37;
    margin-bottom: 16px;
  }
  ```
- Buttons: `background: transparent; border: 1px solid #D4AF37; color: #D4AF37; letter-spacing: 0.15em; text-transform: uppercase; font-size: 0.8rem; padding: 14px 36px;`
  Hover: `background: #D4AF37; color: #0F0F0F;`
- Cards: `background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 2px; padding: 40px;`

## What to Avoid

- Bright or saturated colors
- Rounded pill shapes
- Bold/heavy body text
- White backgrounds
- Sans-serif fonts
