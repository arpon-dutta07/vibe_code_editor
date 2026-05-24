export interface WebsiteType {
  label: string
  icon: string
  description: string
  promptLayer: string
}

const LANDING_PAGE_PROMPT = `
WEBSITE TYPE — Landing Page:
Generate a single-page site with these sections IN ORDER:
1. <header>: Sticky navbar with logo (text-based) + 3 nav links + CTA button (right-aligned)
2. <section class="hero">: Full-viewport height. Large headline (h1), subheadline (p),
   primary CTA button, secondary ghost button. Optional: abstract decorative shape using CSS
3. <section class="social-proof">: Single row of 4-5 company logo placeholders (grey rectangles)
   with label "Trusted by teams at..."
4. <section class="features">: h2 heading + 3-column CSS Grid of feature cards
   (icon placeholder + title + description)
5. <section class="how-it-works">: h2 + numbered 3-step horizontal flow with connecting line
6. <section class="testimonials">: h2 + 2-3 quote cards with avatar placeholder, name, role
7. <section class="cta-final">: Full-width colored band, large heading, single CTA button
8. <footer>: Logo, 3 link columns, copyright line
`

const PORTFOLIO_PROMPT = `
WEBSITE TYPE — Portfolio / Resume:
Generate a single-page portfolio with these sections:
1. <header>: Simple navbar with name as logo + nav links (Work, About, Contact)
2. <section class="hero">: Split layout — left: name, title, 2-line bio, CTA "View Work" and "Download CV";
   right: circular avatar placeholder (200px grey circle)
3. <section class="work">: h2 "Selected Work" + CSS Grid (2 columns) of project cards.
   Each card: image placeholder (16:9 ratio grey div) + project name + 2-word category tag + brief description.
   Minimum 4 project cards.
4. <section class="skills">: Two columns — left: skills list with proficiency indicators (CSS progress bars,
   no JS); right: brief "About Me" paragraph + education/experience timeline (CSS only)
5. <section class="contact">: Centered heading + email link styled as button +
   row of 3-4 social icon links (use Unicode or text: GH, TW, LI, DR)
6. <footer>: Single line — name + copyright + "Made with HTML & CSS"
`

const ECOMMERCE_PROMPT = `
WEBSITE TYPE — E-Commerce Store:
Generate a store front page with these sections (no backend, purely presentational):
1. <header>: Full navbar — logo left, nav center (Home, Shop, About, Contact),
   right: search icon + cart icon with badge "3". Sticky on scroll using CSS position:sticky
2. <section class="hero-banner">: Full-width promotional banner with headline, offer text,
   "Shop Now" CTA. Use a bold background color from the design system.
3. <section class="categories">: h2 "Shop by Category" + horizontal scroll row of
   4-6 category cards (square, label below placeholder image div)
4. <section class="featured-products">: h2 "Featured Products" + CSS Grid 4-column product cards.
   Each card: image placeholder, product name, star rating using text,
   price, "Add to Cart" button
5. <section class="promo-banner">: Split layout — left text offer, right placeholder image
6. <section class="new-arrivals">: Same grid as featured products, 4 different products
7. <footer>: 4-column footer — About, Shop, Support, Newsletter signup (input + button, no JS)
`

export const WEBSITE_TYPES: Record<string, WebsiteType> = {
  // ─── Canonical types (12 from implementation guide) ──────────────────────

  "landing-page": {
    label: "Landing Page",
    icon: "🚀",
    description: "Single-purpose conversion page",
    promptLayer: LANDING_PAGE_PROMPT,
  },

  "portfolio": {
    label: "Portfolio",
    icon: "🎨",
    description: "Showcase work and skills",
    promptLayer: PORTFOLIO_PROMPT,
  },

  "ecommerce": {
    label: "E-Commerce",
    icon: "🛍️",
    description: "Product showcase & store",
    promptLayer: ECOMMERCE_PROMPT,
  },

  "agency": {
    label: "Agency / Service",
    icon: "💼",
    description: "Services, team & case studies",
    promptLayer: `
WEBSITE TYPE — Agency / Service Site:
1. <header>: Logo + nav (Services, Work, Team, Contact) + "Get Quote" CTA button
2. <section class="hero">: Bold agency statement headline, subtext, two CTAs,
   bottom strip of 4 client logo placeholders
3. <section class="services">: h2 + CSS Grid 3-column service cards with icon, title, description,
   "Learn More" link
4. <section class="work">: Alternating layout case studies (2 total) — image left/text right,
   then text left/image right. Each has: client name, project type, result stat, CTA link
5. <section class="stats">: Full-width colored band, 4 large numbers with labels
   (e.g. "200+ Projects", "98% Satisfaction") in a 4-column flex row
6. <section class="team">: h2 + 4-column team member cards (circular avatar placeholder,
   name, role, 3 social icons)
7. <section class="contact">: Two-column — left: contact info + address; right: contact form
   (name, email, message, submit — presentational only)
8. <footer>: Standard agency footer with logo, services list, social links
`,
  },

  "blog": {
    label: "Blog / Magazine",
    icon: "✍️",
    description: "Articles, stories & content",
    promptLayer: `
WEBSITE TYPE — Blog / Magazine:
1. <header>: Publication name (styled as wordmark) + category nav + search icon. Clean, editorial feel.
2. <section class="hero-article">: Large featured article card spanning full width —
   big image placeholder (maintain 21:9 ratio), category tag, title (large h1), author + date +
   read time, excerpt, "Read Article" link
3. <section class="main-content">: Two-column layout (70/30 split):
   LEFT (main feed):
     - "Latest Articles" h2 + 3 article cards (horizontal: image left, text right)
     - "Editors Pick" h2 + 2-column grid of 4 article cards
   RIGHT (sidebar):
     - About blurb card
     - "Popular Tags" cloud (styled spans)
     - "Newsletter" signup card (input + button)
     - "Most Read" list (5 numbered article links)
4. <section class="categories">: Full-width category strips — 4 category blocks each with
   colored background, category name, article count
5. <footer>: Publication name, tagline, category links, social links, copyright
`,
  },

  "saas": {
    label: "SaaS Product",
    icon: "⚡",
    description: "Software product promo page",
    promptLayer: `
WEBSITE TYPE — SaaS Product Page:
1. <header>: Logo + nav (Product, Pricing, Docs, Blog) + "Sign In" link + "Start Free" button
2. <section class="hero">: Center-aligned. Large product claim headline, subheadline,
   email input + "Get Started Free" button (presentational), "No credit card required" microcopy.
   Below: product UI mockup placeholder (wide grey rectangle with simulated window chrome using CSS)
3. <section class="logos">: "Used by 10,000+ teams" + 5 company logo placeholders
4. <section class="features-deep">: Alternating feature blocks (3 total) —
   each: illustration placeholder (left or right) + heading + 3 bullet points with check icons
   + optional CTA link
5. <section class="pricing">: h2 "Simple Pricing" + 3-column pricing cards.
   Each: plan name, price (large), period, feature list (5 items with check/cross), CTA button.
   Middle card: visually highlighted as "Most Popular" with badge
6. <section class="faq">: h2 + CSS-only accordion (using details+summary) with 5-6 Q&As
7. <section class="final-cta">: Colored band, headline, subtext, two buttons
8. <footer>: Product logo, 4 column links, social links, legal links, copyright
`,
  },

  "event": {
    label: "Event / Conference",
    icon: "🎤",
    description: "Events, conferences & meetups",
    promptLayer: `
WEBSITE TYPE — Event / Conference Page:
1. <header>: Event logo + nav (Schedule, Speakers, Venue, Register) + "Register Now" CTA
2. <section class="hero">: Full-screen. Event name (large), tagline, date + city prominently displayed,
   countdown timer display (visual only — static numbers in styled boxes: DD HH MM SS labels),
   "Register Now" button + "View Schedule" ghost button
3. <section class="about">: h2 + 3-column value props for attending + event stats strip
   (speakers count, attendees, days, workshops)
4. <section class="speakers">: h2 "Featured Speakers" + CSS Grid 4-6 speaker cards
   (circular avatar, name, role, company, topic tag)
5. <section class="schedule">: h2 + tabbed schedule by day (CSS-only tab via checkbox hack).
   Each day: timeline list with time, talk title, speaker name, track tag
6. <section class="venue">: Split — left: venue name, address, description;
   right: map placeholder (grey rectangle with pin emoji centered)
7. <section class="sponsors">: Logo grid by tier (Gold/Silver/Bronze) — styled placeholder rectangles
8. <section class="register">: Bold CTA section with pricing tiers and register button
9. <footer>: Event branding, nav links, social, copyright
`,
  },

  "restaurant": {
    label: "Restaurant / Venue",
    icon: "🍽️",
    description: "Food, drink & hospitality",
    promptLayer: `
WEBSITE TYPE — Restaurant / Venue:
1. <header>: Restaurant name as elegant wordmark + nav (Menu, About, Reservations, Contact).
   Transparent header over hero, becomes solid on scroll (CSS only: use position:sticky)
2. <section class="hero">: Full viewport, dark overlay on background color,
   restaurant name centered, tagline, "View Menu" + "Reserve Table" buttons
3. <section class="intro">: 3-column: ambiance blurb + "Our Story" blurb + hours of operation card
4. <section class="menu">: h2 "Our Menu" + CSS tabs (checkbox hack) for categories:
   Starters / Mains / Desserts / Drinks.
   Each tab: 2-column menu item list — item name left, price right, description below item name
5. <section class="specials">: Highlighted box "Today's Specials" — 2-3 featured items in cards
6. <section class="gallery">: CSS Masonry-style grid (column-count: 3) with placeholder divs
   of varying heights and warm background colors
7. <section class="reservations">: Split — left: "Make a Reservation" form
   (name, date, time, guests, message — presentational); right: contact info + map placeholder
8. <footer>: Name, address, phone, hours, social links
`,
  },

  "nonprofit": {
    label: "Non-Profit / Cause",
    icon: "❤️",
    description: "Charities, NGOs & causes",
    promptLayer: `
WEBSITE TYPE — Non-Profit / Cause:
1. <header>: Organization name + nav (Mission, Programs, Impact, Donate). "Donate" button in accent color.
2. <section class="hero">: Emotional, full-width hero. Large cause statement headline,
   brief emotional subtext, "Donate Now" primary CTA + "Learn More" secondary.
   Optional: urgency strip "Every donation matched until [date]"
3. <section class="mission">: h2 "Our Mission" + 2-column: left large mission statement paragraph;
   right: 3 stacked principle cards with icon + title + 1-line description
4. <section class="impact">: Full-width colored band. h2 "Our Impact" + 4 large impact stats
   (e.g. "10,000 Families Helped", "50 Countries") in flex row. Source/year in small text below each.
5. <section class="programs">: h2 "Our Programs" + 3-column program cards:
   image placeholder, program name, description, "Learn More" link
6. <section class="stories">: h2 "Stories of Change" + 2 horizontal story cards:
   avatar placeholder, pull quote, name, location
7. <section class="donate">: Full-width high-contrast section. h2 urgency headline.
   Donation amount selector (CSS-styled radio buttons: $10, $25, $50, $100, Custom).
   "Donate Now" large button. Trust signals: "Secure", "Tax Deductible", "100% Goes to Cause"
8. <footer>: Logo, mission tagline, program links, social links, legal, EIN number
`,
  },

  "personal-brand": {
    label: "Personal Brand",
    icon: "🌟",
    description: "Authors, creators & speakers",
    promptLayer: `
WEBSITE TYPE — Personal Brand / About:
1. <header>: First name as wordmark + nav (About, Work, Speaking, Blog, Contact). Minimal.
2. <section class="hero">: Split — left: "Hi, I'm [Name]" + title/descriptor in large type,
   3-line bio, 2 CTAs ("Work With Me" + "Read My Writing");
   right: large circular avatar placeholder (300px)
3. <section class="credibility">: Horizontal strip — "As seen in" + 4-5 publication name placeholders
4. <section class="about">: Alternating — large personal photo placeholder + long-form
   origin story paragraph (2-3 paras). Authentic, not corporate.
5. <section class="services">: h2 "How I Can Help" + 3 service cards (speaking, consulting, writing etc)
6. <section class="featured-work">: h2 + 2-column grid of 4 work/project cards
7. <section class="speaking">: Talk topics list + past event logos (placeholders)
8. <section class="newsletter">: Centered, personal tone. "Join N,000 readers" headline +
   email input + subscribe button + "No spam, unsubscribe anytime" microcopy
9. <footer>: Name, one-liner, social links row, copyright
`,
  },

  "documentation": {
    label: "Docs / Wiki",
    icon: "📚",
    description: "Technical docs & guides",
    promptLayer: `
WEBSITE TYPE — Documentation / Wiki Site:
Layout: Two-panel fixed layout — LEFT sidebar (fixed, scrollable) + RIGHT main content area

1. <header>: Full-width top bar — logo left, search bar center (styled input, presentational),
   version badge, GitHub link, "Get Started" button. Fixed position.
2. <aside class="sidebar">: Fixed left panel (240px wide).
   Sections: Getting Started (3 links), Core Concepts (4 links), API Reference (5 links),
   Guides (4 links), each section with bold category label + indented links.
   Active link highlighted per design system accent color.
3. <main class="content">: Scrollable main area with:
   - Breadcrumb nav (Home > Docs > Getting Started)
   - h1 page title
   - "On this page" mini TOC (anchor links in a styled box)
   - Content blocks: paragraphs, h2/h3 headings
   - Code blocks: pre+code with monospace font + contrasting background
   - Info/Warning callout boxes (colored left border + icon)
   - A simple table with 3 columns (Option, Type, Description)
   - Next/Previous navigation buttons at bottom
4. Layout: CSS Grid — sidebar fixed, content area scrolls independently (overflow-y: auto)
`,
  },

  "coming-soon": {
    label: "Coming Soon",
    icon: "⏳",
    description: "Pre-launch & waitlist pages",
    promptLayer: `
WEBSITE TYPE — Coming Soon / Pre-Launch:
Single, focused page. No distractions. One goal: capture email or build hype.
1. <header>: Logo/brand name only. No nav links.
2. <section class="main">: Full-screen vertically centered content:
   - Optional: "Coming Soon" small uppercase tag above headline
   - Large, bold product/brand name headline
   - 1-2 sentence teaser (what is being launched)
   - Countdown timer display (visual only — styled boxes DD/HH/MM/SS with labels below)
   - Email capture: input + "Notify Me" button (presentational — no backend)
   - Social proof: "Join 1,200+ on the waitlist" in small muted text
3. <section class="features-teaser">: 3 upcoming feature pills/tags displayed
   as blurred/obscured cards (CSS: filter: blur(2px) with "Coming Soon" overlay)
4. Social links row: 3-4 social icon links (text-based)
5. <footer>: Copyright single line, minimal
`,
  },

  // ─── Legacy aliases — existing DB values stay valid ───────────────────────

  "landing": {
    label: "Landing Page",
    icon: "🚀",
    description: "Single-purpose conversion page",
    promptLayer: LANDING_PAGE_PROMPT,
  },

  "ecom": {
    label: "E-Commerce",
    icon: "🛍️",
    description: "Product showcase & store",
    promptLayer: ECOMMERCE_PROMPT,
  },
}
