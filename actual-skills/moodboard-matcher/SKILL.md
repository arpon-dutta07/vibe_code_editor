# Skill: Moodboard Matcher

Apply mood adjectives to design micro-decisions.

## Instructions

Look for mood adjectives in the user's message. Common adjectives: Bold, Calm, Playful, Serious, Futuristic, Warm, Cold, Minimal, Loud, Elegant, Premium, Raw, Dreamy, Sharp, Cozy, Trustworthy, Edgy, Friendly, Fast, Soft.

Apply these design rules based on detected adjectives:

| Adjective | Design Rules |
|-----------|-------------|
| Bold | `font-weight: 900` headings, high contrast colors, large font sizes |
| Calm | Muted palette, generous whitespace, slow transitions (0.4s+) |
| Playful | High border-radius (16px+), bright accent pops, slight rotations on decorative elements |
| Serious | Serif fonts, dark navy/charcoal, structured grid, minimal decoration |
| Futuristic | Monospace or geometric sans, dark bg, cyan/purple accents, sharp corners |
| Warm | Color temperature shift to oranges/yellows/reds, soft shadows |
| Cold | Blues/teals/whites, crisp shadows, clinical spacing |
| Minimal | Maximum whitespace, reduce decorative elements, muted palette |
| Loud | Increase heading size 20%+, bold color fills on sections |
| Elegant | Thin font weights (300), generous letter-spacing, gold/cream accents |
| Premium | Dark background, gold accents, serif headings, refined spacing |
| Dreamy | Soft gradients, blurred backgrounds, pastel palette, rounded everything |
| Sharp | Zero border-radius, high contrast, geometric precision |

These mood rules override specific properties of the design style where they conflict.

If no adjectives are found, ask the user which 1-3 mood words describe the feeling they want. Or make a reasonable assumption and state it clearly.

The person looking at the finished site should immediately feel the selected moods — not just see a generic page.
