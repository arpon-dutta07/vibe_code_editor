# Skill: Logo to Website

Build a fully branded site using brand colors and identity provided by the user.

## Instructions

The user wants a site that matches their brand identity. Look for brand colors in their message (hex codes, color names, or descriptions like "dark blue and gold").

Build the entire color system around those brand colors:
- Primary brand color → buttons, links, accents, active states
- Secondary color → section backgrounds, card accents, dividers
- Neutral/background → derive a suitable light or dark neutral from the palette

If the user mentions a logo file (logo.png, logo.svg), include `<img src="logo.png" alt="Brand logo">` in the `<header>` with appropriate sizing (height: 40px, auto width).

Override the design style's color variables with the brand colors but keep its typography, spacing, and layout rules intact.

Every section should feel like it belongs to one coherent brand — not a generic template with swapped colors.

If no brand colors are provided, ask the user for their primary brand color before generating, or make a reasonable assumption and note it.
