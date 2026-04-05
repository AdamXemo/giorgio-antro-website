# Stripe Integration Handoff

## What you are doing
Replacing the Shopify checkout redirect with a fully custom Stripe checkout UI.
The user wants complete control over the checkout experience — no redirect to Shopify.

## Current branch: `stripe`
- `shopify` branch — frozen, preserves the Shopify checkout redirect implementation
- `stripe` branch — this is where all work happens
- `main` branch — same as shopify branch (the last clean commit)

## Stack
- Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 3.4
- Supabase (PostgreSQL) — orders table already created and working
- Resend — order confirmation + contact form emails, already working
- Vercel target deployment

## What to REMOVE (Shopify)
1. `lib/shopify.ts` — entire file, delete it
2. `app/api/create-checkout/route.ts` — entire file, delete it
3. `app/api/webhook/route.ts` — entire file, delete it (Shopify webhook)
4. `app/cart/page.tsx` — remove the checkout button that calls `/api/create-checkout`. Replace with a "PROCEED TO CHECKOUT" link to `/checkout`.
5. `package.json` — no Shopify-specific packages to remove (none were installed as npm packages; Shopify was API-only)
6. `env.example.txt` — remove SHOPIFY_* and SHOPIFY_WEBHOOK_SECRET vars

## What to KEEP (everything else is fine)
- `lib/db.ts` — Supabase client (getDb lazy pattern)
- `lib/orders.ts` — Supabase order CRUD (createOrder, getOrderByShopifyId→rename to getOrderByStripeId, updateOrderStatus)
- `lib/email.ts` — Resend email (sendOrderConfirmation, sendContactEmail)
- `app/api/contact/route.ts` — contact form, no changes
- `app/order/success/page.tsx` — success page, minor copy tweak possible
- `types/cart.ts` — CartItem interface
- `components/CartContext.tsx` — cart state
- All UI pages (home, product, about, contact, products)

## What to BUILD (Stripe)

### Install
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### New env vars needed
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...        # exposed to client (NEXT_PUBLIC_)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### New files to create

#### 1. `app/checkout/page.tsx` — Custom checkout page (client component)
Full checkout form with:
- Customer info section: name, email, phone (optional)
- Shipping address: line1, line2 (optional), city, state/province, postal code, country
- Stripe Elements card input (CardElement or PaymentElement)
- Order summary sidebar showing cart items, subtotal, shipping ($0 or $10), total
- Submit button that triggers payment

Design must match the existing ANTRO aesthetic:
- Black/white color scheme
- `font-display` for headings, clean sans-serif for inputs
- Same input style as contact page: `border-b border-black/15` underline inputs
- Same button style: `btn-primary` for submit
- `pt-[73px]` top padding for fixed header
- Show a loading/processing state during payment

Flow:
1. On mount: call `POST /api/create-payment-intent` with cart items → get `clientSecret`
2. Wrap form in `<Elements stripe={stripePromise} options={{ clientSecret }}>` (Stripe Elements)
3. On submit: `stripe.confirmPayment()` with the customer's details
4. Stripe redirects to `/order/success?payment_intent=pi_xxx` on success

#### 2. `app/api/create-payment-intent/route.ts` — Server route
- Receives `{ items: CartItem[], customerEmail?: string }`
- Calculates total (price × quantity for each item, + shipping if subtotal < 100)
- Creates Stripe PaymentIntent: `stripe.paymentIntents.create({ amount: totalInCents, currency: 'eur', metadata: { items: JSON.stringify(items) } })`
- Returns `{ clientSecret }`

Amount in cents: `Math.round(total * 100)`
Currency: EUR (adjust if needed — user is in Belgium)

#### 3. `app/api/stripe-webhook/route.ts` — Stripe webhook handler
Listen for `payment_intent.succeeded`:
- Retrieve the PaymentIntent with expanded charges to get billing details
- Map to Order shape and call `createOrder()`
- Call `sendOrderConfirmation()` fire-and-forget
- Return 200

Stripe webhook verification:
```typescript
const sig = req.headers.get('stripe-signature') ?? ''
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
```

#### 4. Update `lib/orders.ts`
- Rename `shopifyOrderId` / `shopifyOrderNumber` fields to `stripePaymentIntentId` / `stripePaymentIntentId`
- OR just repurpose `shopifyOrderId` → store the Stripe PaymentIntent ID there (simpler, avoids DB migration)
- Update `getOrderByShopifyId` → `getOrderByStripePaymentIntentId`

**Recommended simpler approach**: Add a `stripe_payment_intent_id` column to Supabase instead of renaming (additive migration, no data loss):
```sql
alter table public.orders add column if not exists stripe_payment_intent_id text unique;
create index if not exists orders_stripe_pi_idx on public.orders (stripe_payment_intent_id);
```
Then add `getOrderByStripePaymentIntentId(paymentIntentId: string)` function.

### Order success page
`app/order/success/page.tsx` — already exists. Optionally read `?payment_intent=` from URL to show order number, but static thank-you is fine too.

### Cart page changes
`app/cart/page.tsx` — the checkout button currently calls `POST /api/create-checkout` (Shopify). Replace with:
```tsx
<Link href="/checkout" className="btn-primary w-full text-center block">
  PROCEED TO CHECKOUT
</Link>
```
Remove the `handleCheckout` async function and `checkoutLoading` state entirely.

## Stripe account setup needed (user action)
1. Create Stripe account at stripe.com
2. Get test keys from Dashboard → Developers → API keys
3. Set up webhook in Dashboard → Developers → Webhooks → Add endpoint → URL: `https://yourdomain.com/api/stripe-webhook` → Event: `payment_intent.succeeded`
4. Get webhook signing secret

## Key design decisions
- Use **PaymentElement** (not CardElement) — it supports more payment methods (cards, iDEAL, Bancontact etc.) which matters since the user is in Belgium
- Currency **EUR** — user is in Belgium
- Idempotency: check `getOrderByStripePaymentIntentId` before creating order in webhook (same pattern as Shopify)
- Webhook fire-and-forget email (same pattern as before)

## Files that need updating summary
| File | Action |
|------|--------|
| `lib/shopify.ts` | DELETE |
| `app/api/create-checkout/route.ts` | DELETE |
| `app/api/webhook/route.ts` | DELETE, replace with `app/api/stripe-webhook/route.ts` |
| `app/cart/page.tsx` | Replace checkout button with Link to /checkout |
| `lib/orders.ts` | Add `getOrderByStripePaymentIntentId` function |
| `app/checkout/page.tsx` | CREATE — full custom checkout UI |
| `app/api/create-payment-intent/route.ts` | CREATE |
| `app/api/stripe-webhook/route.ts` | CREATE |
| `env.example.txt` | Remove SHOPIFY_*, add STRIPE_* |

## Supabase migration to run
```sql
alter table public.orders add column if not exists stripe_payment_intent_id text unique;
create index if not exists orders_stripe_pi_idx on public.orders (stripe_payment_intent_id);
```

## Existing patterns to follow
- Lazy client init pattern (see `lib/db.ts` getDb(), `lib/shopify.ts` getShopifyConfig()) — use same for Stripe client
- sr-only labels on form inputs (see `app/contact/page.tsx`)
- `pt-[73px]` on every page top div
- `btn-primary` / `btn-ghost` CSS classes in globals.css
- underline input style: `px-0 py-3.5 bg-transparent border-b border-black/15 focus:border-black outline-none text-sm`
- Toast notifications via `sonner` (already installed)
- All API routes use `NextRequest/NextResponse`
- `export const runtime = 'nodejs'` on webhook routes

## Context about the project
- Single product: ANTRO Classic Hoodie, handle `sailor-hooded-zip-jacket`, price $89.99
- Free shipping on orders >= $100, otherwise $10 (this logic is in cart/page.tsx)
- One size only (ONE SIZE)
- Owner is in Belgium → EUR currency, consider iDEAL/Bancontact via PaymentElement
- Target domain: giorgioantro.com (not yet purchased)
- `npm run typecheck` and `npm run build` must pass clean before considering done
