# Design Style: 3D Layered

CSS depth, perspective transforms, floating elements. Modern SaaS, creative tools.

## Color System

```css
:root {
  --color-bg:     #F8FAFF;
  --color-blue:   #4361EE;
  --color-purple: #7209B7;
  --color-text:   #1B1F3B;
  --color-muted:  #6B7280;
  --color-surface:#FFFFFF;
}
```

## Typography

- Import: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap`
- Font: `'Plus Jakarta Sans', system-ui, sans-serif` — 400/600/800
- Gradient headings:
  ```css
  h1, h2 {
    background: linear-gradient(135deg, #4361EE, #7209B7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  ```

## Layout

- Hero elements: `transform: perspective(1000px) rotateX(2deg);` for depth
- Floating animation on key visual elements:
  ```css
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }
  .floating { animation: float 4s ease-in-out infinite; }
  ```

## 3D Card Stack Pattern

```css
.layered-card {
  position: relative;
  z-index: 1;
  background: white;
  border-radius: 16px;
}
.layered-card::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  width: 100%;
  height: 100%;
  background: rgba(67,97,238,0.2);
  border-radius: inherit;
  z-index: -1;
}
```

Apply `.layered-card` to all major cards and feature blocks.

## Component Rules

- Buttons: `background: linear-gradient(135deg, #4361EE, #7209B7); border-radius: 8px; color: white; border: none;`
  Shadow: `box-shadow: 0 4px 15px rgba(67,97,238,0.4), 0 1px 3px rgba(0,0,0,0.1);`
- Section bg: soft gradient `linear-gradient(180deg, #F8FAFF 0%, #EEF1FF 100%)`
- Floating decorative blobs: CSS `border-radius` shapes with gradient fills, low opacity

## What to Avoid

- Flat zero-depth layouts
- Purely monochrome palette
- Heavy/dark backgrounds
- Static, non-animated hero sections
