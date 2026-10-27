# Tissy's Tasty Platters

A lightweight, responsive catering website and quotation-request app built with
HTML, CSS, and vanilla JavaScript. It has no build step or external runtime
dependencies.

## Run locally

Open `index.html` in a browser, or use VS Code Live Server.

## Features

- Responsive homepage, service information, and contact links
- Filterable illustrative service catalogue
- Quantity-adjustable quotation basket
- Event-details form with required-field and consent validation
- WhatsApp handoff to +27 78 916 1088
- No prices, online payments, analytics, or server-side data storage

The catalogue is intentionally quote-only: confirm the actual menu, offerings,
photos, and prices with the business before publishing them. The customer
reviews the prepared message in WhatsApp and must press **Send**; this site does
not submit or store enquiries itself.

## Business details to confirm before launch

- Confirm the contact phone and email shown on the site.
- The site uses **Benoni East AH, Gauteng** as the service area based on the
  Facebook page description. It does not publish an unverified street address.
- Confirm delivery, collection, booking, and privacy terms with the business.

## Deploy

Upload `index.html`, `styles.css`, `script.js`, and the `assets` folder to a
static host such as Netlify, Cloudflare Pages, or GitHub Pages. No secrets or
credentials belong in these client-side files.

## Project files

- `index.html` — page structure and content
- `styles.css` — visual styling and responsive layouts
- `script.js` — catalogue, basket, validation, and WhatsApp message handoff
- `assets/logo.jpg` — supplied brand artwork, shown in the header
- `assets/platters.jpg` — supplied platter photo, shown in the homepage hero
