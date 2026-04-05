# ANTRO — Fashion E-Commerce Website

A minimal, modern e-commerce storefront for the **ANTRO** fashion brand, built with Next.js 15 and connected to Shopify for checkout and order management.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 3.4 |
| Language | TypeScript |
| Payments / Checkout | Shopify Storefront API (cart + checkout redirect) |
| Email | Nodemailer (order confirmations) |
| Hosting target | Vercel |

---

## Project Structure

```
app/
  about/          — About page
  admin/          — Password-protected admin view
  api/
    contact/      — Contact form handler
    create-checkout/ — Creates Shopify cart, returns checkoutUrl
    orders/       — Order listing endpoint
    webhook/      — Shopify webhook receiver (HMAC-verified)
  cart/           — Cart page
  contact/        — Contact page
  order/          — Order confirmation page
  products/       — Product listing page
  product/        — Single product page
  test-shopify/   — Dev page for testing Shopify connection

components/
  CartContext.tsx  — Global cart state (localStorage, SSR-safe)
  Header.tsx
  Footer.tsx
  ProductGrid.tsx
  NewsletterForm.tsx

data/
  products.ts     — Product definitions (single product: ANTRO Classic Hoodie)

lib/
  shopify.ts      — Shopify Storefront GraphQL client
  shopify/        — Query helpers
  orders.ts       — File-based order storage (dev only)
  email.ts        — Order confirmation email templates

hooks/
  useCart.ts      — Re-export of useCart from CartContext
```

---

## Current Development Stage

The project is in **pre-launch / active development**. Core UI and routing are complete. Shopify integration is partially wired — checkout redirect works, but webhook handlers are stubs.

### What works
- Full storefront UI (home, product page, cart, about, contact)
- Cart state with localStorage persistence and SSR hydration guard
- Shopify checkout redirect (`/api/create-checkout`)
- Shopify webhook endpoint with HMAC signature verification
- Contact form with server-side XSS sanitization
- Admin order view (password-protected)
- Order confirmation email template (written, not yet triggered)

### What is NOT yet implemented / still needed before deploy

1. **Product content** — All 6 product images are the same placeholder file. Real photos and copy need to be added.
2. **Shopify product variants** — Shopify store must have size variants matching: `S`, `M`, `L`, `XL`, `XXL`.
3. **Webhook handlers** — `app/api/webhook/route.ts` handlers are TODO stubs. Order fulfillment, cancellation, and payment events are not processed.
4. **Email sending** — `lib/email.ts` is complete but `sendOrderConfirmation()` is never called. Needs to be wired into the order/webhook flow.
5. **Order storage** — `lib/orders.ts` uses the local filesystem, which does not persist on Vercel. Must be replaced with a database (e.g. Supabase, PlanetScale, Upstash) before deployment.
6. **Newsletter** — `NewsletterForm.tsx` has no API call; submitted emails are silently dropped. Needs a backend (e.g. Mailchimp API, a DB table).
7. **Environment variables** — All secrets must be set in Vercel project settings before deploying. See `env.example.txt` for the required keys.
8. **Domain & SEO** — No custom domain configured. Metadata and OG images not finalized.
9. **Analytics** — No tracking set up yet.

---

## Environment Variables Required

See `env.example.txt` for a full list. Key variables:

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
SHOPIFY_ADMIN_TOKEN=
SHOPIFY_WEBHOOK_SECRET=
ADMIN_PASSWORD=
NEXT_PUBLIC_SITE_URL=
EMAIL_USER=
EMAIL_PASS=
```

---

## Running Locally

```bash
npm install
cp env.example.txt .env.local   # fill in your values
npm run dev
```
