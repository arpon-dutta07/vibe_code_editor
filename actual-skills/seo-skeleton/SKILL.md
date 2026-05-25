# Skill: SEO Skeleton Builder

Generate production-ready SEO markup on every page.

## Instructions

Every page you generate MUST include a complete `<head>` section with all SEO tags:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{Descriptive Page Title} | {Brand Name}</title>
  <meta name="description" content="{150-160 char description including primary keyword}">
  <meta name="keywords" content="{3-5 relevant keywords}">
  <link rel="canonical" href="https://example.com/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="{Page Title}">
  <meta property="og:description" content="{Meta description}">
  <meta property="og:url" content="https://example.com/">
  <meta property="og:image" content="https://picsum.photos/seed/og/1200/630">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{Page Title}">
  <meta name="twitter:description" content="{Meta description}">
  <meta name="twitter:image" content="https://picsum.photos/seed/og/1200/630">

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "{Brand Name}",
    "url": "https://example.com"
  }
  </script>
</head>
```

Additional requirements:
- Use only semantic HTML5: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- Every image must have a descriptive `alt` attribute
- Strict heading hierarchy: one `<h1>`, multiple `<h2>`, `<h3>` as needed
- At the very bottom of `<body>`, add a styled SEO Preview Panel using `<details><summary>SEO Preview</summary>`:
  - A mocked Google SERP result card (title in blue, URL in green, description snippet)
  - A mocked Open Graph social share card (image thumbnail left, title + description right)
  - Style with pure HTML/CSS — light grey background, bordered, collapsible
