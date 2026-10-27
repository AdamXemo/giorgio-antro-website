/**
 * Deterministic environment for the hermetic suite.
 *
 * These are fake values on purpose: every external service is mocked, so the
 * only thing that matters is that the variables are *present* and stable.
 * Real credentials are never loaded here — see `tests/setup/real-api-env.ts`
 * for the sandbox suite.
 */
process.env.STRIPE_SECRET_KEY = 'sk_test_hermetic'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_hermetic_test_secret'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_hermetic'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://hermetic.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-hermetic'
process.env.RESEND_API_KEY = 're_hermetic'
process.env.NEXT_PUBLIC_SITE_URL = 'https://giorgioantro.test'
